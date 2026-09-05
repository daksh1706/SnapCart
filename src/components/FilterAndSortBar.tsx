'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, ArrowUpDown, Tag, Check, RotateCcw, ChevronDown } from 'lucide-react'

export interface FilterState {
    category: string;
    maxPrice: number;
    onlyDiscounted: boolean;
    sortBy: 'default' | 'price_low' | 'price_high' | 'discount_high' | 'name_asc';
}

interface FilterAndSortBarProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    totalResults: number;
}

export default function FilterAndSortBar({
    categories,
    selectedCategory,
    onCategoryChange,
    filters,
    onFiltersChange,
    totalResults
}: FilterAndSortBarProps) {
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

    const sortOptions = [
        { label: 'Default / Popular', value: 'default' },
        { label: 'Price: Low to High', value: 'price_low' },
        { label: 'Price: High to Low', value: 'price_high' },
        { label: 'Highest Discount %', value: 'discount_high' },
        { label: 'Name (A to Z)', value: 'name_asc' },
    ]

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({
            ...filters,
            sortBy: e.target.value as FilterState['sortBy']
        })
    }

    const handleReset = () => {
        onFiltersChange({
            category: 'All',
            maxPrice: 1000,
            onlyDiscounted: false,
            sortBy: 'default'
        })
        onCategoryChange('All')
    }

    const hasActiveFilters = filters.maxPrice < 1000 || filters.onlyDiscounted || filters.sortBy !== 'default' || selectedCategory !== 'All'

    return (
        <div className="w-full mb-6 space-y-4">
            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                {['All', ...categories].map((cat) => {
                    const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                    return (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                                    : 'bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200/80 hover:border-emerald-300 shadow-2xs'
                            }`}
                        >
                            {cat}
                        </button>
                    )
                })}
            </div>

            {/* Quick Actions & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs">
                {/* Result count & active indicator */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                    <span>Showing <strong className="text-emerald-700 font-bold">{totalResults}</strong> items</span>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset Filters
                        </button>
                    )}
                </div>

                {/* Filter and Sort triggers */}
                <div className="flex items-center gap-2">
                    {/* Discount toggle button */}
                    <button
                        onClick={() => onFiltersChange({ ...filters, onlyDiscounted: !filters.onlyDiscounted })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            filters.onlyDiscounted
                                ? 'bg-emerald-100/70 border-emerald-400 text-emerald-800'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                        }`}
                    >
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden xs:inline">On Sale</span>
                        {filters.onlyDiscounted && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    {/* Filter Modal trigger */}
                    <button
                        onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            filters.maxPrice < 1000
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filter</span>
                        {filters.maxPrice < 1000 && (
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={filters.sortBy}
                            onChange={handleSortChange}
                            className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Expandable Price Filter Panel */}
            <AnimatePresence>
                {filterDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 overflow-hidden"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                                    <span>Max Price:</span>
                                    <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                                        ₹{filters.maxPrice}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="1000"
                                    step="10"
                                    value={filters.maxPrice}
                                    onChange={(e) => onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                                    <span>₹20</span>
                                    <span>₹500</span>
                                    <span>₹1000+</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setFilterDrawerOpen(false)}
                                className="self-end sm:self-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
