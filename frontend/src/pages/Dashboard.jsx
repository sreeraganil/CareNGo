// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../api/api";

const Dashboard = () => {
  const [bookingType, setBookingType] = useState("myself");
  const user = useAuthStore((s) => s.user);
  const getProfile = useAuthStore((s) => s.getProfile);
  const [showWarning, setShowWarning] = useState(false);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("Standard SafeRide");
  const [passengers, setPassengers] = useState("1");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [otherPassenger, setOtherPassenger] = useState({
    name: "",
    aadhaar: "",
    phone: "",
    age: "",
    gender: "",
    relationship: "",
    specialRequirements: [],
  });

  const [recentRides, setRecentRides] = useState([]);

  const relationships = [
    "My Child",
    "My Parent",
    "My Sibling",
    "My Grandparent",
    "My Relative",
    "My Friend",
    "My Dependent",
    "Other",
  ];

  const specialRequirementsOptions = [
    "Wheelchair accessible vehicle",
    "Child car seat required",
    "Elderly assistance needed",
    "Medical equipment space",
    "Female driver preferred",
    "Extra care needed",
    "No music preference",
    "Temperature control needed",
  ];

  const handleOtherPassengerChange = (field, value) => {
    setOtherPassenger((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecialRequirementToggle = (requirement) => {
    setOtherPassenger((prev) => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter((req) => req !== requirement)
        : [...prev.specialRequirements, requirement],
    }));
  };

  const canSubmit = useMemo(() => {
    if (!pickup.trim() || !destination.trim()) return false;
    if (bookingType === "others") {
      if (
        !otherPassenger.name.trim() ||
        !otherPassenger.phone.trim() ||
        !otherPassenger.age ||
        !otherPassenger.gender ||
        !otherPassenger.relationship
      ) {
        return false;
      }
      if (!emergencyName.trim() || !emergencyPhone.trim()) return false;
    }
    return true;
  }, [pickup, destination, bookingType, otherPassenger, emergencyName, emergencyPhone]);

  useEffect(() => {
    (async () => {
      try {
        await getProfile();
      } catch (err) {
        const msg =
          err?.response?.data?.detail || err?.message || "Failed to load profile";
        toast.error(msg);
      } finally {
        setLoadingProfile(false);
      }
    })();

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.put("/auth/booking/");
      setRecentRides(
        (res.data || []).map((b) => ({
          id: b.id,
          from: b.pickup,
          to: b.destination,
          date: b.created_at_human || b.created_at || "",
          status: b.status || "Created",
          type: b.ride_type || "Standard SafeRide",
          passenger: b.booking_type === "others"
            ? b.other_passenger?.name || "Passenger"
            : "Myself",
        }))
      );
    } catch (e) {
      console.warn("Failed to load bookings", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    const loadingId = toast.loading("Booking your ride...");

    const payload = {
      pickup_location: pickup,
      destination,
      ride_type: rideType,
      passengers: passengers === "4+" ? 4 : Number(passengers),
      booking_type: bookingType,
      other_passenger:
        bookingType === "others"
          ? {
              name: otherPassenger.name,
              aadhaar: otherPassenger.aadhaar,
              phone: otherPassenger.phone,
              age: Number(otherPassenger.age || 0),
              gender: otherPassenger.gender,
              relationship: otherPassenger.relationship,
              special_requirements: otherPassenger.specialRequirements,
            }
          : null,
      emergency_contact:
        bookingType === "others"
          ? {
              name: emergencyName,
              phone: emergencyPhone,
            }
          : null,
    };

    try {
      await api.post("/auth/booking/", payload);
      toast.success("Ride booked successfully!", { id: loadingId });

      setPickup("");
      setDestination("");
      setRideType("Standard SafeRide");
      setPassengers("1");
      setEmergencyName("");
      setEmergencyPhone("");
      setOtherPassenger({
        name: "",
        aadhaar: "",
        phone: "",
        age: "",
        gender: "",
        relationship: "",
        specialRequirements: [],
      });

      fetchBookings();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" && err.response.data) ||
        "Failed to create booking";
      toast.error(msg, { id: loadingId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSOS = () => {
  setShowWarning(true)
  setTimeout(()=>{
    setShowWarning(false)
  }, 1500)
};

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
              <span className="ml-2 text-xl font-bold text-gray-900">
                Care N'Go
              </span>
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
        {/* Welcome */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              {loadingProfile
                ? "Loading profile..."
                : `Welcome back, ${user?.username ?? user?.name ?? "Guest"}! 👋`}
            </h1>
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

        {/* Book Ride Card */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Book a Safe Ride
            </h2>

            {/* Booking Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who is traveling?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBookingType("myself")}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    bookingType === "myself"
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        bookingType === "myself"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {bookingType === "myself" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Book for Myself
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        I will be traveling
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType("others")}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    bookingType === "others"
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        bookingType === "others"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {bookingType === "others" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Book for Others
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Booking for family/friends
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Other Passenger */}
            {bookingType === "others" && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-blue-600 mr-2">👥</span>
                  Passenger Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={otherPassenger.name}
                      onChange={(e) =>
                        handleOtherPassengerChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter passenger's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      value={otherPassenger.aadhaar}
                      onChange={(e) =>
                        handleOtherPassengerChange(
                          "aadhaar",
                          e.target.value.replace(/\D/g, "").slice(0, 12)
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter 12-digit Aadhaar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={otherPassenger.phone}
                      onChange={(e) =>
                        handleOtherPassengerChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={otherPassenger.age}
                      onChange={(e) =>
                        handleOtherPassengerChange(
                          "age",
                          String(
                            Math.max(1, Math.min(120, Number(e.target.value || 0)))
                          )
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={otherPassenger.gender}
                      onChange={(e) =>
                        handleOtherPassengerChange("gender", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <select
                      value={otherPassenger.relationship}
                      onChange={(e) =>
                        handleOtherPassengerChange("relationship", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Relationship</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Special Requirements
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specialRequirementsOptions.map((requirement, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={otherPassenger.specialRequirements.includes(
                            requirement
                          )}
                          onChange={() =>
                            handleSpecialRequirementToggle(requirement)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {requirement}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-yellow-600 mr-2">📞</span>
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ride Booking Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter pickup location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ride Type *
                  </label>
                  <select
                    value={rideType}
                    onChange={(e) => setRideType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option>Standard SafeRide</option>
                    <option>Women Only</option>
                    <option>Kids Friendly</option>
                    <option>Wheelchair Accessible</option>
                    <option>Elderly Care</option>
                    <option>Medical Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers *
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={`w-full text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200
                ${
                  !canSubmit || submitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                }`}
              >
                {submitting
                  ? "Booking..."
                  : bookingType === "myself"
                  ? "Find My Safe Ride"
                  : "Book Ride for Passenger"}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rides</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {recentRides.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No rides yet.</div>
            ) : (
              recentRides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {ride.from} → {ride.to}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ride.type === "Women Only"
                              ? "bg-pink-100 text-pink-800"
                              : ride.type === "Kids Friendly"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ride.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {ride.date} • For: {ride.passenger}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showWarning && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sos-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={()=>setShowWarning(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div className="relative mx-4 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="px-6 pt-6 pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <span className="text-3xl">🚨</span>
              </div>
              <h3
                id="sos-modal-title"
                className="text-2xl font-bold text-gray-900 text-center"
              >
                WARNING
              </h3>
              <p className="mt-3 text-center text-gray-700 text-lg">
                sos message send
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Your SOS has been triggered. Stay safe — help is being notified.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={()=>setShowWarning(false)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating SOS button */}
<button
  type="button"
  onClick={handleSOS}
  className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full font-semibold shadow-lg 
             bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2
             focus:ring-red-400 focus:ring-offset-2"
  aria-label="Send SOS"
  title="Send SOS"
>
  🚨 SOS
</button>

    </div>
  );
};

export default Dashboard;
