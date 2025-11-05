import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

const Dashboard = () => {
  const [bookingType, setBookingType] = useState('myself');
  const user = useAuthStore((s) => s.user);
  const getProfile = useAuthStore((s) => s.getProfile);
  const [otherPassenger, setOtherPassenger] = useState({
    name: '',
    aadhaar: '',
    phone: '',
    age: '',
    gender: '',
    relationship: '',
    specialRequirements: []
  });

  const quickActions = [
    { icon: '🚗', title: 'Book Ride', description: 'Book a safe ride', color: 'bg-purple-100 text-purple-600' },
    { icon: '👩', title: 'Women Only', description: 'Female drivers only', color: 'bg-pink-100 text-pink-600' },
    { icon: '👶', title: 'Kids Ride', description: 'With car seats', color: 'bg-blue-100 text-blue-600' },
    { icon: '♿', title: 'Accessible', description: 'Wheelchair friendly', color: 'bg-green-100 text-green-600' },
  ];

  const recentRides = [
    { id: 1, from: 'Home', to: 'School', date: '2 hours ago', status: 'Completed', type: 'Kids Ride', passenger: 'My Daughter' },
    { id: 2, from: 'Office', to: 'Mall', date: 'Yesterday', status: 'Completed', type: 'Women Only', passenger: 'Myself' },
    { id: 3, from: 'Hospital', to: 'Home', date: '2 days ago', status: 'Completed', type: 'Accessible', passenger: 'My Mother' },
  ];

  const relationships = [
    'My Child',
    'My Parent',
    'My Sibling',
    'My Grandparent',
    'My Relative',
    'My Friend',
    'My Dependent',
    'Other'
  ];

  const specialRequirementsOptions = [
    'Wheelchair accessible vehicle',
    'Child car seat required',
    'Elderly assistance needed',
    'Medical equipment space',
    'Female driver preferred',
    'Extra care needed',
    'No music preference',
    'Temperature control needed'
  ];

  const handleOtherPassengerChange = (field, value) => {
    setOtherPassenger(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialRequirementToggle = (requirement) => {
    setOtherPassenger(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(req => req !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };


  useEffect(()=>{
    getProfile()
  },[])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Care N'Go</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <span className="text-lg">🔔</span>
              </button>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
            <p className="opacity-90">Ready for your next safe journey?</p>
            <div className="mt-4 flex space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <span className="text-sm">👩 Woman Passenger</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                <span className="text-sm">👶 Parent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} text-xl mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Book Ride Card */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book a Safe Ride</h2>
            
            {/* Booking Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Who is traveling?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBookingType('myself')}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    bookingType === 'myself'
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      bookingType === 'myself' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {bookingType === 'myself' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Book for Myself</h3>
                      <p className="text-sm text-gray-600 mt-1">I will be traveling</p>
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setBookingType('others')}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    bookingType === 'others'
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      bookingType === 'others' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {bookingType === 'others' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Book for Others</h3>
                      <p className="text-sm text-gray-600 mt-1">Booking for family/friends</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Other Passenger Details */}
            {bookingType === 'others' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-blue-600 mr-2">👥</span>
                  Passenger Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={otherPassenger.name}
                      onChange={(e) => handleOtherPassengerChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter passenger's full name"
                    />
                  </div>

                  {/* Aadhaar Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number *
                    </label>
                    <input
                      type="text"
                      value={otherPassenger.aadhaar}
                      onChange={(e) => handleOtherPassengerChange('aadhaar', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter 12-digit Aadhaar"
                      maxLength="12"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={otherPassenger.phone}
                      onChange={(e) => handleOtherPassengerChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={otherPassenger.age}
                      onChange={(e) => handleOtherPassengerChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter age"
                      min="1"
                      max="120"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={otherPassenger.gender}
                      onChange={(e) => handleOtherPassengerChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <select
                      value={otherPassenger.relationship}
                      onChange={(e) => handleOtherPassengerChange('relationship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Relationship</option>
                      {relationships.map(rel => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Special Requirements
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specialRequirementsOptions.map((requirement, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={otherPassenger.specialRequirements.includes(requirement)}
                          onChange={() => handleSpecialRequirementToggle(requirement)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{requirement}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ride Booking Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter pickup location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ride Type *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                    <option>Standard SafeRide</option>
                    <option>Women Only</option>
                    <option>Kids Friendly</option>
                    <option>Wheelchair Accessible</option>
                    <option>Elderly Care</option>
                    <option>Medical Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passengers *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact for Others */}
              {bookingType === 'others' && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-yellow-600 mr-2">📞</span>
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full bg-linear-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-200">
                {bookingType === 'myself' ? 'Find My Safe Ride' : 'Book Ride for Passenger'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rides</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {recentRides.map((ride) => (
              <div key={ride.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{ride.from} → {ride.to}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ride.type === 'Women Only' ? 'bg-pink-100 text-pink-800' :
                        ride.type === 'Kids Ride' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ride.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ride.date} • For: {ride.passenger}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {ride.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Features */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Safety Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🛡️</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Emergency Button</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 text-xl">📱</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Live Tracking</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Share Ride</h3>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">⭐</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">Verified Drivers</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;