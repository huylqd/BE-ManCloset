import { ICate } from "../interface/category";
import Category from "../model/category";
import Product from "../model/product";
import { categorySchema } from "../schema/categorySchema";
import unidecode from 'unidecode';
import { checkInteger } from "../utils/checkNumber";
import { dataQuery, dataQueryPaginate } from "../utils/dataQuery";
export const createCategory = async (req: any, res: any) => {
  try {
   
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
    const categoryExistsDelete = await (Category as any).findWithDeleted({ deleted: true,name: name});
    console.log(categoryExistsDelete);

    if(categoryExistsDelete.length !== 0){
      return res.status(404).json({
        message: "Danh mục đã tồn tại trong thùng rác vui lòng vào thùng rác để khôi phục lại",
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
  //   const getAllCategory = await (await Category.find()).filter((cate:ICate) => !cate.deleted)
  //   console.log(getAllCategory);

  //  const totalPage = Math.ceil(getAllCategory.length / result.limit);
      
      
      // const categoryResponse =  await { ...result, docs: searchDataCategory };
      //  console.log(categoryResponse.docs);
      res.status(200).json({
        message: "Category get all successfully",
        data: result.docs,
        paginate: {
          currentPage: result.page,
          totalPages:result.totalPages,
          totalItems:result.totalDocs,
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
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { name } = req.body;
    const { id } = req.params;
    const categoryExists = await Category.findOne({ name , _id: { $ne: id } });
    if (categoryExists) {
      return res.status(404).json({
        message: "Danh mục đã tồn tại",
      });
    }

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
    const productsToUpdate = await Product.find({categoryId:id})
    const newCategoryId = '658334e2cdced64d5bb0a07b';
    let newCategory = await Category.findById(newCategoryId);
     await Promise.all(productsToUpdate.map(async (product:any) => {
        newCategory.products.push(product._id)
        await Product.findOneAndUpdate({_id:product._id},{categoryId:newCategoryId},{new:true})
    }));
  
     
    
      const removedCategory = await Category.deleteOne({_id:id});
      console.log(removedCategory);
      await newCategory.save();
    res.status(200).json({
      message: "Category remove successfully",
      data: removedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting category list",
    });
  }
};
export const getAllDeleteCategory = async (req, res) => {
  
  try {
    const query = req.query;
    const options = {
      page: checkInteger(+query?.page) ? +query.page - 1 : 0,
      limit: checkInteger(+query?.limit) ? +query.limit : 10,
      sort: query.sort || "createdAt",
      order: query.order || "desc",
    };
      const totalCategory = await (Category as any).findWithDeleted({ deleted: true });
      const totalPages = Math.ceil(totalCategory.length / options.limit);
      const category = await (Category as any).findWithDeleted({ deleted: true }).sort({
        [options.sort as string]: options.order as string,
      }).skip((options.page) * options.limit  ).limit(options.limit as number);
      const result = dataQueryPaginate(totalCategory,category,+options.limit, +options.page,totalPages)
      return res.status(200).json({
          message: "Lấy tất cả sản phẩm đã bị xóa",
          data:result,  
      });
  } catch (error) {
      return res.status(500).json({
          message: error,
      })
  }
};

export const remove = async (req,res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const id = req.params.id
    const category = await Category.findById(id)
  console.log(category);
  
    if(!category) {
      return res.status(400).json({
        message: "Không tìm thấy danh mục",
    })
    }
    if(category.name == "khác"){
      return res.status(404).json({
        message: "Danh mục này không được xóa",
    })
    }
    if (category) {
      await (category as any).delete()
  }
    return res.status(200).json({
      message: "Xoá danh mục thành công chuyển sang thùng rác",
      data:category
  })
  } catch (error) {
    return res.status(500).json({
      message: error,
  })
  }
}
export const restoreCategory = async (req, res) => {
  try {
      const restoredCategory = await (Category as any).restore({ _id: req.params.id }, { new: true });
      if (!restoredCategory) {
          return res.status(400).json({
              message: "Danh mục không tồn tại hoặc đã được khôi phục trước đó.",
          });
      }

      return res.status(200).json({
          message: "Khôi phục danh mục thành công.",
          data: restoredCategory,
      });
  } catch (error) {
      return res.status(400).json({
          message: error.message,
      });
  }
};