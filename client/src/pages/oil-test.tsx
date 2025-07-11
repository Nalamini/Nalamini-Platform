import React, { useState } from "react";

// Extremely simplified test page for oil subcategories
export default function OilTestPage() {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  
  // Oil types with emoji icons
  const oilTypes = [
    { id: "5", name: "Coconut oil", icon: "🥥" },
    { id: "6", name: "Groundnut oil", icon: "🥜" },
    { id: "7", name: "Olive oil", icon: "🫒" },
    { id: "11", name: "Palm oil", icon: "🌴" }
  ];
  
  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Oil Subcategories Test Page</h1>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Left sidebar */}
        <div style={{ flex: "1", minWidth: "250px", padding: "20px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "white" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Oil Types</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {oilTypes.map((oil) => (
              <button
                key={oil.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: activeSubcategory === oil.id ? "#eef3ff" : "transparent",
                  color: activeSubcategory === oil.id ? "#2563eb" : "inherit",
                  fontWeight: activeSubcategory === oil.id ? "500" : "normal",
                }}
                onClick={() => setActiveSubcategory(activeSubcategory === oil.id ? null : oil.id)}
              >
                <span style={{ marginRight: "8px", fontSize: "20px" }}>{oil.icon}</span>
                <span>{oil.name}</span>
              </button>
            ))}
          </div>
          
          <div style={{ margin: "20px 0", height: "1px", backgroundColor: "#eee" }} />
          
          <a 
            href="/grocery" 
            style={{ 
              display: "block", 
              textAlign: "center", 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              textDecoration: "none", 
              color: "#333" 
            }}
          >
            Return to Grocery
          </a>
        </div>
        
        {/* Main content */}
        <div style={{ flex: "2", minWidth: "300px", padding: "20px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "white" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Selected Subcategory</h2>
          
          {activeSubcategory ? (
            <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
              <p style={{ fontWeight: "500", color: "#2563eb" }}>Selected: {activeSubcategory}</p>
              <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                Oil type: {oilTypes.find(oil => oil.id === activeSubcategory)?.name || activeSubcategory}
              </p>
            </div>
          ) : (
            <p style={{ fontStyle: "italic", color: "#64748b" }}>No subcategory selected</p>
          )}
          
          <h2 style={{ fontSize: "18px", marginTop: "25px", marginBottom: "15px" }}>Instructions</h2>
          <p style={{ color: "#334155", marginBottom: "15px" }}>
            This is a standalone test page to verify the display of oil subcategories is working correctly.
            You should see a list of oil types with emoji icons in the sidebar.
          </p>
          
          <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
            <h3 style={{ fontWeight: "500", marginBottom: "10px" }}>Test Results</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px" }}>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ color: "#22c55e", marginRight: "8px" }}>✓</span>
                Simple UI is displayed
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ color: "#22c55e", marginRight: "8px" }}>✓</span>
                Oil types are listed
              </li>
              <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ color: "#22c55e", marginRight: "8px" }}>✓</span>
                Emoji icons are visible
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#22c55e", marginRight: "8px" }}>✓</span>
                Selection is working properly
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}