import {
  addEmployee,
  deleteEmployee,
  fetchEmployeeById,
  fetchEmployees,
  updateEmployee,
} from "./employee";

import {
  fetchEmployeesLog,
  fetchEmployeesRange,
  fetchEmployeesToday,
  fetchEmployeesAll,
  timeIn,
  timeOut,
} from "./employeesLog";

import { addKey, fetchKeys } from "./keys";

import {
  fetchKeysLog,
  borrowKey,
  returnKey,
  fetchKeysRange,
  fetchKeysToday,
  fetchKeysAll,
} from "./keysLog";

import {
  fetchVisitors,
  fetchVisitorsRange,
  visitorLogin,
  visitorLogout,
  fetchVisitorsToday,
  fetchVisitorsAll,
} from "./visitors";

const services = {
  // 🟦 Employees
  fetchEmployees,
  fetchEmployeesLog,
  fetchEmployeesToday,
  fetchEmployeesAll,
  fetchEmployeesRange,
  timeIn,
  timeOut,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployeeById,

  // 🟨 Keys
  fetchKeys,
  fetchKeysLog,
  fetchKeysToday,
  fetchKeysAll,
  fetchKeysRange,
  borrowKey,
  returnKey,
  addKey,

  // 🟩 Visitors
  fetchVisitors,
  fetchVisitorsToday,
  fetchVisitorsAll,
  fetchVisitorsRange,
  visitorLogin,
  visitorLogout,
};

export default services;