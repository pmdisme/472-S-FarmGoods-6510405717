import React from 'react';

const ActionDropdown = () => {
    const handleChange = (e) => {
        const value = e.target.value;

        if (value === 'new') {
            console.log('Creating new product...');
            // เพิ่มโค้ดสร้างสินค้าใหม่ตรงนี้
        }
        else if (value === 'hide') {
            console.log('Hiding product...');
            // เพิ่มโค้ดซ่อนสินค้าตรงนี้
        }

        // รีเซ็ตค่า select กลับเป็น default
        e.target.value = 'more';
    };

    return (
        <div style={{ position: 'relative' }}>
            <select
                onChange={handleChange}
                defaultValue="more"
                style={selectStyle}
            >
                <option value="more" disabled hidden>More Actions</option>
                <option value="Hide Product">Hide Product</option>
                <option value="New Product">New Product</option>
            </select>
            <style>{`
                select option {
                    background-color: white;
                    color: #79CDCD;
                    height: "3rem",
                    width: "9.25rem",
                }
                
                select option:hover {
                    background-color: #79CDCD;
                }
            `}</style>
        </div>
    );
};

const selectStyle = {
    marginTop: "1.5rem",
    backgroundColor: "#79CDCD",
    height: "3rem",
    width: "9.25rem",
    border: "none",
    borderRadius: "1rem",
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginLeft: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 525,
    color: "white",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 1rem",
    lineHeight: "1",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.8rem center",
    backgroundSize: "1.25rem",
    paddingRight: "0.5rem"
};

export default ActionDropdown;