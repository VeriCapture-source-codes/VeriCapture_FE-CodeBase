import React from 'react';
import { Nav } from 'react-bootstrap';

const SidebarMenu = () => {
  return (
    <div className="bg-light vh-100 p-3 border-end">
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="#" className="mb-2"><i className="bi bi-house me-2" />Home</Nav.Link>
        <Nav.Link href="#"><i className="bi bi-compass me-2" />Explore</Nav.Link>
        <Nav.Link href="#"><i className="bi bi-bell me-2" />Notification</Nav.Link>
        <Nav.Link href="#"><i className="bi bi-person me-2" />Profile</Nav.Link>
        <Nav.Link href="#"><i className="bi bi-gear me-2" />Settings</Nav.Link>
      </Nav>
    </div>
  );
};

export default SidebarMenu;
