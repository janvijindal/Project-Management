import React from "react";
import { TbRefresh } from "react-icons/tb";

const categories = [
  "Full Stack Project",
  "Frontend Project",
  "Backend Project",
];

const tags = [
  "Reactjs",
  "Nextjs",
  "Tailwindcss",
  "JavaScript",
  "MongoDB",
  "Express.js",
  "Git", "GitHub", "REST API", "TypeScript", "Angular", "Vue.js", "OAuth", "JWT", "Auth0"
];

const Aside = ({ selectedCategories, setSelectedCategories, selectedTags, setSelectedTags }) => {
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  return (
    <div className="w-[300px] h-[600px] overflow-y-auto border border-gray-300 p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <TbRefresh className="text-gray-300 cursor-pointer" onClick={handleResetFilters} />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h2 className="text-md font-semibold mb-2">Category</h2>
          <span className="w-full h-[1px] bg-slate-200 mb-2"></span>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="text-blue-500"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-md font-semibold mb-2">Tags</h2>
          <span className="w-full h-[1px] bg-slate-200 mb-2"></span>
          <div className="flex flex-col gap-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                  className="text-blue-500"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aside;
