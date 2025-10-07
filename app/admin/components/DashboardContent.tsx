"use client";
import EmployeePage from "../employee/page";
import KeysPage from "../room/page";

type Props = {
  active: string;
};

export default function DashboardContent({ active }: Props) {
  switch (active) {
    // Employees
    case "employees":
      return <EmployeePage />;
    case "rooms":
      return <KeysPage/>
    // Settings
    case "settings":
      return <div className="p-4">⚙️ Settings page here</div>;

    default:
      return <div className="p-4">Select a menu item</div>;
  }
}
