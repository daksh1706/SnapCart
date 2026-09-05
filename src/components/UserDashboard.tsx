'use client'
import React, { useState, useMemo } from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import GroceryItemCard from './GroceryItemCard'
import FilterAndSortBar, { FilterState } from './FilterAndSortBar'
import FlashDealBanner from './FlashDealBanner'
import FloatingMobileCart from './FloatingMobileCart'
import { IGrocery } from '@/types/index'
import { Sparkles, PackageOpen } from 'lucide-react'

function UserDashboard({ groceryList }: { groceryList: IGrocery[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    maxPrice: 1000,
    onlyDiscounted: false,
    sortBy: 'default'
  })

  // Extract unique categories from grocery list
  const categories = useMemo(() => {
    const set = new Set<string>()
    groceryList.forEach(item => {
      if (item.category) set.add(item.category)
    })
    return Array.from(set)
  }, [groceryList])

  // Filter and sort items
  const filteredList = useMemo(() => {
    return groceryList
      .filter(item => {
        // Category filter
        if (selectedCategory !== 'All' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false
        }
        // Price filter
        if (Number(item.sellingprice) > filters.maxPrice) {
          return false
        }
        // Discount filter
        if (filters.onlyDiscounted) {
          const discount = Number(item.originalprice) - Number(item.sellingprice)
          if (discount <= 0) return false
        }
        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_low') {
          return Number(a.sellingprice) - Number(b.sellingprice)
        }
        if (filters.sortBy === 'price_high') {
          return Number(b.sellingprice) - Number(a.sellingprice)
        }
        if (filters.sortBy === 'discount_high') {
          const discA = ((Number(a.originalprice) - Number(a.sellingprice)) / Number(a.originalprice)) || 0
          const discB = ((Number(b.originalprice) - Number(b.sellingprice)) / Number(b.originalprice)) || 0
          return discB - discA
        }
        if (filters.sortBy === 'name_asc') {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
  }, [groceryList, selectedCategory, filters])

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Category Slider */}
      <CategorySlider />

      {/* Products & Dynamic Filter Area */}
      <div className='w-[92%] max-w-7xl mx-auto mt-12'>
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Express 10-Min Delivery
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 text-center tracking-tight'>
            Fresh Groceries & Essentials
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center max-w-lg">
            Sourced daily from local organic farms and delivered straight to your door.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <FilterAndSortBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredList.length}
        />

        {/* Product Grid */}
        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-xs text-center my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No products match your filters</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              Try adjusting your price range or clearing some filters to explore more items.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setFilters({ category: 'All', maxPrice: 1000, onlyDiscounted: false, sortBy: 'default' })
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
            {filteredList.map((item: any) => (
              <GroceryItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Mobile Cart summary pill */}
      <FloatingMobileCart />
    </div>
  )
}

export default UserDashboard