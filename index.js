const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.model");
initializeDatabase();
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

async function readAllHotels(hotels) {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    console.log("Error occured in reading all hotels", error);
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured in fetching all hotels" });
  }
});

async function readHotelByName(name) {
  try {
    const hotelByName = await Hotel.find({ name: name });

    return hotelByName;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in fetching hotel by name" });
  }
});

async function readHotelByPhoneNumber(numb) {
  try {
    const hotelByPhoneNumber = await Hotel.findOne({ phoneNumber: numb });
    return hotelByPhoneNumber;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "no hotel found by phone number" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occured in fetching hotel bu phone number" });
  }
});

async function readHotelByRating(rating) {
  try {
    const hotelByRating = await Hotel.find({ rating: rating });
    return hotelByRating;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotel = await readHotelByRating(req.params.hotelRating);
    if (hotel != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found " });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occurred while fetching hotel by rating" });
  }
});

async function readHotelByCategory(category) {
  try {
    const hotelByCategory = await Hotel.find({ category: category });
    return hotelByCategory;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotel = await readHotelByCategory(req.params.hotelCategory);
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found by category" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occurred in fetching hotel by category" });
  }
});

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const saveHotel = await hotel.save();
    return saveHotel;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully", hotel: savedHotel });
  } catch (error) {
    console.error("Error adding hotel:", error);
    res.status(500).json({ error: "Failed to add hotel" });
  }
});

async function deleteHotelById(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({ message: "Hotel deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Hotel" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

async function updateHotel(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log("Error occured in updsting hotel data", error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body);
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHotel: updatedHotel,
      });
    } else {
      res.status(404).json({ error: "Restaurants not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel" });
  }
});
