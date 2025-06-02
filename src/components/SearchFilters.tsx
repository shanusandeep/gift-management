
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";

interface SearchFilters {
  searchTerm: string;
  category: string;
  occasion: string;
  ageGroup: string;
  gender: string;
  status: string;
  priceRange: [number, number];
  recipient: string;
  dateFrom: string;
  dateTo: string;
}

const SearchFiltersComponent = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: 'all',
    occasion: 'all',
    ageGroup: 'all',
    gender: 'all',
    status: 'all',
    priceRange: [0, 500],
    recipient: '',
    dateFrom: '',
    dateTo: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Mock search results
  const mockResults = [
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      recipient: 'Sarah',
      occasion: 'Birthday',
      ageGroup: 'adult',
      gender: 'female',
      price: 89,
      status: 'purchased',
      dateGiven: '2024-06-15'
    },
    {
      id: '2',
      name: 'LEGO Building Set',
      category: 'Toys',
      recipient: 'Tom',
      occasion: 'Birthday',
      ageGroup: 'child',
      gender: 'male',
      price: 45,
      status: 'wrapped'
    },
    {
      id: '3',
      name: 'Coffee Maker',
      category: 'Home',
      recipient: 'Mom',
      occasion: 'Mother\'s Day',
      ageGroup: 'adult',
      gender: 'female',
      price: 120,
      status: 'delivered'
    }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update active filters
    if (value && value !== 'all' && key !== 'searchTerm' && key !== 'priceRange') {
      if (!activeFilters.includes(key)) {
        setActiveFilters(prev => [...prev, key]);
      }
    } else if (!value || value === 'all') {
      setActiveFilters(prev => prev.filter(filter => filter !== key));
    }
  };

  const clearFilter = (filterKey: string) => {
    handleFilterChange(filterKey as keyof SearchFilters, 'all');
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      occasion: 'all',
      ageGroup: 'all',
      gender: 'all',
      status: 'all',
      priceRange: [0, 500],
      recipient: '',
      dateFrom: '',
      dateTo: ''
    });
    setActiveFilters([]);
  };

  const getFilterLabel = (key: string, value: string) => {
    const labels: Record<string, string> = {
      category: 'Category',
      occasion: 'Occasion',
      ageGroup: 'Age Group',
      gender: 'Gender',
      status: 'Status',
      recipient: 'Recipient'
    };
    return `${labels[key]}: ${value}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'secondary';
      case 'purchased': return 'default';
      case 'wrapped': return 'outline';
      case 'delivered': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredResults = mockResults.filter(item => {
    const matchesSearch = !filters.searchTerm || 
      item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || item.category.toLowerCase() === filters.category.toLowerCase();
    const matchesOccasion = filters.occasion === 'all' || item.occasion.toLowerCase() === filters.occasion.toLowerCase();
    const matchesAgeGroup = filters.ageGroup === 'all' || item.ageGroup === filters.ageGroup;
    const matchesGender = filters.gender === 'all' || item.gender === filters.gender;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesRecipient = !filters.recipient || item.recipient.toLowerCase().includes(filters.recipient.toLowerCase());
    const matchesPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesOccasion && 
           matchesAgeGroup && matchesGender && matchesStatus && 
           matchesRecipient && matchesPrice;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Search & Filters</h2>
        <p className="text-gray-600">Find gifts and recipients with advanced filtering</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search gifts, recipients, or occasions..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
                {activeFilters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Occasion</Label>
                <Select value={filters.occasion} onValueChange={(value) => handleFilterChange('occasion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All occasions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All occasions</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="christmas">Christmas</SelectItem>
                    <SelectItem value="valentine">Valentine's Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange('ageGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All age groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All age groups</SelectItem>
                    <SelectItem value="child">Child (0-12)</SelectItem>
                    <SelectItem value="teenager">Teenager (13-19)</SelectItem>
                    <SelectItem value="adult">Adult (20-64)</SelectItem>
                    <SelectItem value="senior">Senior (65+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="purchased">Purchased</SelectItem>
                    <SelectItem value="wrapped">Wrapped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Recipient</Label>
                <Input
                  placeholder="Filter by recipient"
                  value={filters.recipient}
                  onChange={(e) => handleFilterChange('recipient', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map(filterKey => (
                    <Badge key={filterKey} variant="secondary" className="flex items-center gap-1">
                      {getFilterLabel(filterKey, filters[filterKey as keyof SearchFilters] as string)}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => clearFilter(filterKey)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Recipient:</span>
                      <span className="text-sm">{item.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Occasion:</span>
                      <span className="text-sm">{item.occasion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Age Group:</span>
                      <span className="text-sm">{item.ageGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="text-sm">{item.gender}</span>
                    </div>
                    {item.dateGiven && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Date Given:</span>
                        <span className="text-sm">{new Date(item.dateGiven).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No results found. Try adjusting your filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
