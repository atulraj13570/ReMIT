import mongoose from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    required: true
  },
  authorBatch: {
    type: String
  },
  authorBranch: {
    type: String
  },
  authorProfilePic: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      role: {
        type: String
      },
      profilePic: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('post', PostSchema);
