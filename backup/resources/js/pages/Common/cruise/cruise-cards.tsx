import React from "react";

export default function CruiseCards() {
  const cruises = [
    {
      id: 1,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
    {
      id: 2,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
    {
      id: 3,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
    {
      id: 4,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
    {
      id: 5,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
    {
      id: 6,
      title: "3 Night Bahamas",
      cruiseLine: "MSC Divina",
      departing: "Miami, Florida",
      portsOfCall: "Freeport, Grand Bahama Island • Ocean Cay Marine Reserve (Cruise Line Private Island)",
      sailingDates: "January 2025 • February 2025 • March 2025",
      image: "/placeholder.svg?height=464&width=535",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="space-y-8">
        {cruises.map((cruise) => (
          <div
            key={cruise.id}
            className="bg-white rounded-[20px] overflow-hidden flex flex-row shadow-lg relative"
            style={{
              width: "1339px",
              height: "464px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "535px", height: "464px" }}>
              <img
                src={cruise.image || "/placeholder.svg"}
                alt="Cruise Ship"
                width={535}
                height={464}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              style={{ width: "804px", height: "464px" }}
              className="p-10 flex flex-col justify-center"
            >
              <h2 className="text-[32px] font-bold text-black mb-1">{cruise.title}</h2>
              <p className="text-[18px] font-medium text-black mb-8">{cruise.cruiseLine}</p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 mr-4 mt-1 text-[#0066b2]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[16px] font-semibold">Departing : </span>
                    <span className="text-[16px]">{cruise.departing}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 mr-4 mt-1 text-[#0066b2]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8C18 4.5 15 3 12 3C9 3 6 4.5 6 8C6 11.5 3 10 3 16L4.5 17.5H19.5L21 16C21 10 18 11.5 18 8Z"></path>
                      <path d="M12 20V17.5"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[16px] font-semibold">Ports of calls: </span>
                    <span className="text-[16px]">{cruise.portsOfCall}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 mr-4 mt-1 text-[#0066b2]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[16px] font-semibold">Sailing Dates: </span>
                    <span className="text-[16px]">{cruise.sailingDates}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="bg-[#0066b2] hover:bg-[#005091] text-white font-medium py-3 px-8 rounded-md transition-colors">
                  View Itinerary
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
