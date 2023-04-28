import axios from "../apiConnection"

class StockApi {
    constructor() {
        this.axios = axios; // Store the axios instance in a class property
    }

    getStock(stock) {
        return this.axios.get(`/stock/${stock}/history/`);
    }
}

export default new StockApi();