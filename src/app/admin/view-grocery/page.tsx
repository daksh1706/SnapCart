"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader, Package, Pencil, Search, Trash, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/grocery.model";
import Image from "next/image";

function ViewGrocery() {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [search,setSearch] = useState("")
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage,setBackendImage] = useState<Blob | null>(null)
  const [editLoading,setEditLoading] = useState(false)
  const [deleteLoading,setDeleteLoading] = useState(false)
  const [filtered,setFiltered] = useState<IGrocery[]>()
  const categories = [
    "Fruits & Vegetables",
    "Dairy",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Spices & Masala",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essential",
    "Instant & Packages Food",
    "Baby & Pet Care",
  ];

  const units = ["kg", "gm", "liter", "ml", "piece", "pack"];

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries");
        setGroceries(result.data);
        setFiltered(result.data)
      } catch (error) {
        console.log(error);
      }
    };
    getGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file){
        setBackendImage(file)
        setImagePreview(URL.createObjectURL(file))

    }
  }

  const handleEdit=async()=>{
    setEditLoading(true)
    if(!editing)return null
    try {
        const formData = new FormData()
            formData.append("groceryId",editing?._id?.toString()!)
            formData.append("name",editing.name)
            formData.append("category",editing.category)
            formData.append("size",editing.size)
            formData.append("unit",editing.unit)
            formData.append("originalprice",editing.originalprice)
            formData.append("sellingprice",editing.sellingprice)
            formData.append("description",editing.description!)
            if(backendImage){
                formData.append("image",backendImage)
            }
        const result = await axios.post("/api/admin/edit-grocery",formData)
        window.location.reload()
        setEditLoading(false)
    } catch (error) {
        console.log(error)
        setEditLoading(false)
    }
  }

  const handleDelete=async()=>{
    setDeleteLoading(true)
    if(!editing)return null
    try {
        const result = await axios.post("/api/admin/delete-grocery",{groceryId:editing._id})
        window.location.reload()
        setDeleteLoading(false)
    } catch (error) {
        console.log(error)
        setDeleteLoading(false)
    }
  }

  const handleSearch=(e:React.FormEvent)=>{
    e.preventDefault()
    const q = search.toLowerCase()
    setFiltered(
        groceries?.filter(
            (g)=>g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
        )
    )
  }

  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
          <Package size={28} className="text-green-600" />
          Manage Groceries
        </h1>
      </motion.div>

      {/* search */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSearch}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          placeholder="Search by name or category" value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </motion.form>

      {/* groceries card */}
      <div className="space-y-4">
        {filtered?.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
          >
            {/* Image */}
            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {g.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize">{g.category}</p>
                <p className="text-gray-500 text-sm truncate">
                  {g.description}
                </p>
              </div>
              {/* price,unit */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-green-700 font-bold text-lg">
                  {" "}
                  <span className="line-through text-gray-500 text-sm">
                    ₹{g.originalprice}
                  </span>{" "}
                  ₹{g.sellingprice} /{g.size} {g.unit}
                </p>
                {/* edit */}
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                  onClick={() => setEditing(g)}
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* editing */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            >
              {/* Header - Sticky so it stays visible while scrolling */}
              <div className="sticky top-0 bg-white px-7 py-5 border-b border-gray-100 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-green-700">
                  Edit Product
                </h2>
                <button
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  onClick={() => setEditing(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-7 space-y-5">
                {/* Image Preview - Constrained height */}
                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt={editing.name}
                      fill
                      className="object-contain"
                    />
                  )}
                  <label htmlFor="imageUpload" className="absolute inset-0 bg-black/40 opacity-0.75 group:hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Upload size={28} className="text-green-700"/></label>
                  <input type="file" accept="image/*" hidden id="imageUpload" onChange={handleImageUpload}/>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Product Name"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                      Category
                    </label>
                    <select
                      className="w-full h-[45px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white mt-1"
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    >
                      <option>Select Category</option>
                      {categories.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                        Selling Price
                      </label>
                      <input
                        type="text"
                        value={editing.sellingprice}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            sellingprice: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                        Original Price
                      </label>
                      <input
                        type="text"
                        value={editing.originalprice}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            originalprice: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                        Size
                      </label>
                      <input
                        type="text"
                        value={editing.size}
                        onChange={(e) =>
                          setEditing({ ...editing, size: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                        Unit
                      </label>
                      <select
                        className="w-full h-[45px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white mt-1"
                        value={editing.unit}
                        onChange={(e) =>
                          setEditing({ ...editing, unit: e.target.value })
                        }
                      >
                        <option>Select Unit</option>
                        {units.map((u, i) => (
                          <option key={i} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100" onClick={handleEdit} disabled={editLoading}>
                    <Pencil size={18} /> {editLoading?<Loader size={18} className="animate-spin"/>:"Update Product"}
                  </button>
                  <button className="w-full py-3 rounded-xl bg-white border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2" disabled={deleteLoading}
                  onClick={handleDelete}
                  >
                    <Trash size={18} /> {deleteLoading?<Loader size={18} className="animate-spin" />:"Delete Product"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewGrocery;
