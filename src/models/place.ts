
import { Location } from './location';

export class Place{
    constructor(
        public scene:string,
        public description:string,
        public location:Location,
        public imageUrl:string
    ){}
}