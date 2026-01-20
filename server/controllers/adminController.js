import jwt from "jsonwebtoken";
import { Product } from "../model/schema.js";


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(404).json({ success: false, message: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Admin logged in" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0), //  expire immediately
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};




// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const availableProducts = await Product.countDocuments({ status: 'available' });
    
    const soldProducts = await Product.countDocuments({ status: 'sold' });
    
    // Get total value of available products
    const availableProductsValue = await Product.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    // Get total value of all products
    const totalProductsValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    // Get products by location
    const productsByLocation = await Product.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentProducts = await Product.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get monthly sales trend
    const monthlyTrend = await Product.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    // Get most common colors
    const topColors = await Product.aggregate([
      { $match: { color: { $ne: '', $exists: true } } },
      { $group: { _id: '$color', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Calculate average price
    const averagePriceAgg = await Product.aggregate([
      { $group: { _id: null, average: { $avg: '$price' } } }
    ]);
    
    // Get daily stats for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyStats = await Product.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProducts,
          availableProducts,
          soldProducts,
          recentProducts,
          totalValue: totalProductsValue[0]?.total || 0,
          availableValue: availableProductsValue[0]?.total || 0,
          averagePrice: averagePriceAgg[0]?.average || 0
        },
        analytics: {
          productsByLocation,
          topColors,
          monthlyTrend: monthlyTrend.map(item => ({
            month: `${item._id.year}-${item._id.month}`,
            count: item.count,
            totalValue: item.totalValue
          })),
          dailyStats: dailyStats.map(item => ({
            date: item._id.date,
            count: item.count,
            totalValue: item.totalValue
          }))
        },
        percentages: {
          availablePercentage: totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0,
          soldPercentage: totalProducts > 0 ? Math.round((soldProducts / totalProducts) * 100) : 0,
          growthRate: totalProducts > 0 ? Math.round((recentProducts / totalProducts) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get Recent Activities
export const getRecentActivities = async (req, res) => {
  try {
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name price status createdAt')
      .lean();

    // Format activities
    const activities = recentProducts.map(product => ({
      type: 'product_added',
      title: `Product Added: ${product.name}`,
      description: `Added new product for $${product.price}`,
      status: product.status,
      date: product.createdAt,
      meta: {
        price: product.price,
        status: product.status
      }
    }));

    res.status(200).json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error("Recent Activities Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};