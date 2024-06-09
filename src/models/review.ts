import mongoose, { Schema, Document, Model } from 'mongoose';

interface IReview extends Document {
  reviewID: string;
  reviewArray: {
    review: string;
    rated: number;
  }[];
  overallRating: number;
}

const reviewSchema: Schema = new Schema({
  reviewID: { type: String, required: true, unique: true },
  reviewArray: [
    {
      review: { type: String, required: true },
      rated: { type: Number, required: true },
    },
  ],
  overallRating: { type: Number, min: 1, max: 5 },
});

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
