"use client";

import { useState } from "react";
import EmployeeList from "./EmployeeList";
import EmployeeForm from "./EmployeeForm";

export interface Employee {
  id: number;
  name: string;
  department: string;
  classification: string;
  status?: string;
}

export default function EmployeePage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const employees: Employee[] = [
    { id: 1, name: "John Doe", department: "HR", classification: "Full-Time", status: "Active" },
    { id: 2, name: "Jane Smith", department: "IT", classification: "Part-Time", status: "Inactive" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-[70%] border-r border-gray-300">
        <EmployeeList
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          setIsAdding={setIsAdding}
        />
      </div>

      <div className="w-[30%] bg-white shadow-inner flex flex-col justify-center items-center p-8">
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      </div>
    </div>
  );
}
