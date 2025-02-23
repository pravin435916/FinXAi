import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Settings } from 'lucide-react';

const CategoryManager = ({ categories, onUpdateCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    id: '',
    label: '',
    color: '#3B82F6',
    budget: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdateCategories(
        categories.map(cat => 
          cat.id === editingCategory.id ? { ...editingCategory } : cat
        )
      );
      setEditingCategory(null);
    } else {
      onUpdateCategories([...categories, { ...newCategory, id: newCategory.label.toLowerCase().replace(/\s+/g, '_') }]);
      setNewCategory({ id: '', label: '', color: '#3B82F6', budget: 0 });
    }
  };

  const handleDelete = (categoryId) => {
    onUpdateCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const startEditing = (category) => {
    setEditingCategory({ ...category });
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Manage Categories</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setEditingCategory(null);
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={editingCategory?.label || newCategory.label}
                    onChange={(e) => 
                      editingCategory 
                        ? setEditingCategory({ ...editingCategory, label: e.target.value })
                        : setNewCategory({ ...newCategory, label: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                             text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={editingCategory?.color || newCategory.color}
                    onChange={(e) => 
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, color: e.target.value })
                        : setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Budget
                  </label>
                  <input
                    type="number"
                    value={editingCategory?.budget || newCategory.budget}
                    onChange={(e) => 
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, budget: parseFloat(e.target.value) })
                        : setNewCategory({ ...newCategory, budget: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                             text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                         transition-colors duration-200 flex items-center"
              >
                {editingCategory ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Category
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </>
                )}
              </button>
            </form>

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white">{category.label}</span>
                    <span className="text-gray-400">
                      ${category.budget.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(category)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;