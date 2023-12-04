import Category from "../model/category";
import { categorySchema } from "../schema/categorySchema";
import unidecode from 'unidecode';
export const createCategory = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const { error } = categorySchema.validate(req.body);
    if (error) {
      console.log("error", error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { name } = req.body;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(404).json({
        message: "Danh mục đã tồn tại",
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
  const {
    _page = 1,
    _limit = _page == 0 ? 10000000 : 2,
    _sort = "createdAt",
    _order = "asc",
    _expand,
    _keywords,
  } = req.query;
  const options: any = {
    page: _page,
    limit: _limit,
    sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
  };
  try {
    res.setHeader("Content-Type", "application/json");
    // const searchData = (categories) => {
    //   return categories?.docs?.filter((item) =>
    //     item.name.toLowerCase().includes( _keywords)
    //   );
    // };
// console.log(searchQuery);
    const result = await Category.paginate({}, options);
    if (result.docs.length === 0) {
      res.status(404).json({
        message: "Category not found",
      });
    }else{
      // const searchDataCategory = await searchData(result);
      
      
      // const categoryResponse =  await { ...result, docs: searchDataCategory };
      //  console.log(categoryResponse.docs);
      res.status(200).json({
        message: "Category get all successfully",
        data: result.docs,
        paginate: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          limit:result.limit
        },
      });
    }
 
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};

export const getCategoryById = async (req: any, res: any) => {
  try {
    res.setHeader("Content-Type", "application/json");
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
    res.setHeader("Content-Type", "application/json");
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
    res.setHeader("Content-Type", "application/json");
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const removedCategory = await Category.findByIdAndDelete(id);
    res.status(201).json({
      message: "Category remove successfully",
      data: removedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};
