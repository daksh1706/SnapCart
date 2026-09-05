import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";
import { redirect } from "next/navigation";

async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const session = await auth();
  if (!session?.user?.email && !session?.user?.id) {
    redirect("/login");
  }

  await connectDb();

  let userDoc = null;
  if (session.user.id && session.user.id.length === 24) {
    try {
      userDoc = await User.findById(session.user.id);
    } catch (e) {
      userDoc = null;
    }
  }

  if (!userDoc && session.user.email) {
    userDoc = await User.findOne({ email: session.user.email.toLowerCase() });
  }

  if (!userDoc) {
    redirect("/login");
  }

  const user = JSON.parse(JSON.stringify(userDoc));

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  let groceryList = [];
  if (user.role === "user") {
    let query: any = {};
    if (searchParams.q) {
      query = {
        $or: [
          { name: { $regex: searchParams.q, $options: "i" } },
          { category: { $regex: searchParams.q, $options: "i" } },
        ],
      };
    }
    const groceries = await Grocery.find(query);
    groceryList = JSON.parse(JSON.stringify(groceries));
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
