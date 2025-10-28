// define a type for mongoose ObjectId
import mongoose from 'mongoose';

// check a string is a valid ObjectId
export const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export type ValidObjectIdString = string & {
    __isValidObjectId: true;
};

export type MongooseId = mongoose.Types.ObjectId | ValidObjectIdString;
