import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import { supabase } from "@/lib/supabase";
import { mapUser, mapGrocery } from "@/lib/mappers";
import { IGrocery } from "@/types/index";
import { redirect } from "next/navigation";

async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (userError || !userData) {
    redirect("/login");
  }

  const user = mapUser(userData);
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  let groceryList: IGrocery[] = [];
  if (user.role === "user") {
    let query = supabase.from("groceries").select("*");
    if (searchParams.q) {
      const searchStr = `%${searchParams.q}%`;
      query = query.or(`name.ilike.${searchStr},category.ilike.${searchStr}`);
    }
    const { data: groceriesData, error: groceriesError } = await query;
    if (!groceriesError && groceriesData) {
      groceryList = groceriesData.map(mapGrocery);
    }
  }

  return (
    <>
      <Nav user={user} />
      <GeoUpdater userId={user._id} />
      {user.role === "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </>
  );
}

export default Home;
