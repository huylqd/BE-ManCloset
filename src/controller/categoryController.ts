import Category from "../model/category";
import { categorySchema } from "../schema/categorySchema";

export const createCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      console.log("error", error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const category = await Category.create(req.body);
    if (category) {
      return res.status(201).json({
        // Use HTTP status 201 for resource creation
        message: "Category created successfully",
        data: category,
      });
    } else {
      return res.status(500).json({
        message: "Failed to create category",
      });
    }
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllCategory = async (req: any, res: any) => {
  try {
    // res.setHeader("Content-Type", "application/json");
    const category = await Category.find({});
    // console.log("category:", category);
    if (category.length === 0) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category get all successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};

export const getCategoryById = async (req: any, res: any) => {
  try {
    // res.setHeader("Content-Type", "application/json");
    const { id } = req.params;
    const category = await Category.findById(id);
    // console.log("category:", category);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category get by id successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};
export const updateCategory = async (req: any, res: any) => {
  try {
    // res.setHeader("Content-Type", "application/json");
    const { error } = categorySchema.validate(req.body);
    if (error) {
      console.log("error", error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log("category:", category);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category update successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};
export const removeCategory = async (req: any, res: any) => {
  try {
    // res.setHeader("Content-Type", "application/json");

    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    // console.log("category:", category);
    if (!category) {
      res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category remove successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};
