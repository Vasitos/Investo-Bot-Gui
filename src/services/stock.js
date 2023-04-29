import axios from "../apiConnection"

class StockApi {
    constructor() {
        this.axios = axios; // Store the axios instance in a class property
    }

    getStock(stock) {
        return this.axios.get(`/stock/${stock}/history`);
    }

    getStockRecommendation(stock) {
        return this.axios.get(`/stock/${stock}/suggest`);
    }

    getStockInformation(stock) {
        return this.axios.get(`/stock/${stock}/info`);
    }

    getStockPrediction(stock) {
        return this.axios.get(`/predict/${stock}`);
    }
}

export default new StockApi();