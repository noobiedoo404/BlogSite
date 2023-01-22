export class Blog {
    constructor(
        public user_id:string,
        public category:string,
        public title: string,
        public description: string,
        public body: string,
        public photo: any
    ) {

    }
}
