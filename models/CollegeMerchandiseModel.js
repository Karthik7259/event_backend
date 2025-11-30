import mongoose from "mongoose";

const collegeMerchandiseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const collegeMerchandiseModel = mongoose.models.collegeMerchandise || mongoose.model('collegeMerchandise', collegeMerchandiseSchema);

export default collegeMerchandiseModel;
