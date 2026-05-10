const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed'],
        default: 'planned'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
