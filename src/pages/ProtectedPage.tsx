import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { faker } from "@faker-js/faker";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  isSelected: boolean;
}

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        const initialCategories: Category[] = Array.from(
          { length: 100 },
          () => ({
            id: faker.string.uuid(),
            name: faker.commerce.department(),
            isSelected: false,
          })
        );
        setCategories(initialCategories);
        localStorage.setItem("categories", JSON.stringify(initialCategories));
      }
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isSelected: !category.isSelected }
          : category
      )
    );
  };

  const getSelectedCategories = () => categories.filter((c) => c.isSelected);

  return {
    categories,
    toggleCategory,
    getSelectedCategories,
    isLoading,
  };
};

const Category = () => {
  const { categories, toggleCategory, getSelectedCategories, isLoading } =
    useCategories();
  const [currentPage, setCurrentPage] = useState<number>(4);
  const itemsPerPage = 6;

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    toggleCategory(categoryId);
    if (category) {
      toast.success(
        category.isSelected
          ? `Removed ${category.name} from interests`
          : `Added ${category.name} to interests`,
        {
          duration: 2000,
          position: "bottom-center",
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        }
      );
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const getPaginationArray = () => {
    const range: (number | string)[] = [];
    for (let i = 1; i <= Math.min(7, totalPages); i++) range.push(i);
    if (totalPages > 7) range.push("...");
    return range;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white my-6">
      <div className="flex flex-col max-w-2xl w-full p-6 sm:p-20 font-sans items-center justify-center">
        <div className="bg-white rounded-3xl my-auto flex flex-col border border-gray-200 shadow-lg p-6 sm:p-10 w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">
            Please mark your interests!
          </h2>
                <p className="text-sm sm:text-base text-center text-gray-500 mb-6">
                    We will keep you notified.
                </p>

                <hr className="border-t border-gray-200 mb-6" />

                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-semibold text-gray-800">
                        My saved interests!
                    </h3>
                    <span className="text-sm text-gray-500">
                        {getSelectedCategories().length} selected
                    </span>
                </div>

                <div className="grid gap-3 mb-8">
                    {currentCategories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition shadow-sm"
                        >
                            <div
                                className={`w-6 h-6 flex items-center justify-center rounded ${
                                    category.isSelected ? "bg-black" : "bg-gray-300"
                                }`}
                            >
                                {category.isSelected && (
                                    <Check className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>

                {getSelectedCategories().length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-sm font-medium mb-2">Selected Categories:</p>
                        <div className="flex flex-wrap gap-2">
                            {getSelectedCategories().map((category) => (
                                <span
                                    key={category.id}
                                    className="px-3 py-1 text-xs bg-black text-white rounded-full"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="text-sm px-2 py-1 disabled:opacity-40"
                    >
                        &lt;&lt;
                    </button>

                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-sm px-2 py-1 disabled:opacity-40"
                    >
                        &lt;
                    </button>

                    {getPaginationArray().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === "number" && setCurrentPage(page)}
                            className={`text-sm px-3 py-1 rounded ${
                                currentPage === page
                                    ? "bg-black text-white"
                                    : "text-gray-400 hover:bg-gray-100"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="text-sm px-2 py-1 disabled:opacity-40"
                    >
                        &gt;
                    </button>

                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="text-sm px-2 py-1 disabled:opacity-40"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Category;
