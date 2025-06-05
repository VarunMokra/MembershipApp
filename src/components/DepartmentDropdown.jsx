export default function DepartmentDropdown({ departments, onSelect }) {
  return (
    <select
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
      onChange={(e) => {
        const index = e.target.selectedIndex;
        if (index > 0) {
          const selectedDept = departments[index - 1]; // adjust for placeholder
          onSelect(selectedDept);
        }
      }}
      defaultValue=""
    >
      <option value="" disabled>
        -- Choose Department --
      </option>
      {departments.map((dept, i) => (
        <option key={dept["Sheet ID"]} value={i}>
          {dept["Department Name"]}
        </option>
      ))}
    </select>
  );
}
