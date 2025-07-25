import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="text-sm font-semibold text-zinc-700 mr-2">Filter by:</div>
        
        <Select value={filters.size} onValueChange={val => setFilters(f => ({ ...f, size: val }))}>
          <SelectTrigger className="w-36 border-2 border-indigo-200 focus:border-indigo-400 bg-white/80 hover:bg-white transition-all duration-200">
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border border-indigo-200">
            <SelectItem value="S" className="hover:bg-indigo-50">Small (S)</SelectItem>
            <SelectItem value="M" className="hover:bg-indigo-50">Medium (M)</SelectItem>
            <SelectItem value="L" className="hover:bg-indigo-50">Large (L)</SelectItem>
            <SelectItem value="XL" className="hover:bg-indigo-50">Extra Large (XL)</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.color} onValueChange={val => setFilters(f => ({ ...f, color: val }))}>
          <SelectTrigger className="w-36 border-2 border-purple-200 focus:border-purple-400 bg-white/80 hover:bg-white transition-all duration-200">
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border border-purple-200">
            <SelectItem value="black" className="hover:bg-purple-50">Black</SelectItem>
            <SelectItem value="white" className="hover:bg-purple-50">White</SelectItem>
            <SelectItem value="blue" className="hover:bg-purple-50">Blue</SelectItem>
            <SelectItem value="red" className="hover:bg-purple-50">Red</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.sort} onValueChange={val => setFilters(f => ({ ...f, sort: val }))}>
          <SelectTrigger className="w-48 border-2 border-pink-200 focus:border-pink-400 bg-white/80 hover:bg-white transition-all duration-200">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border border-pink-200">
            <SelectItem value="price-asc" className="hover:bg-pink-50">Price: Low to High</SelectItem>
            <SelectItem value="price-desc" className="hover:bg-pink-50">Price: High to Low</SelectItem>
            <SelectItem value="name-asc" className="hover:bg-pink-50">Name: A to Z</SelectItem>
            <SelectItem value="newest" className="hover:bg-pink-50">Newest First</SelectItem>
          </SelectContent>
        </Select>
        
        {(filters.size || filters.color || filters.sort) && (
          <button
            onClick={() => setFilters({ size: '', color: '', sort: '' })}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
} 