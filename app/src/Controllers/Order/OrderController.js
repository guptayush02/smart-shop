const OrderController = {
  
  async placeOrder(req, res) {
    try {
      console.log("Order place by user")
      // TODO: order place by user and payment integration
    } catch (error) {
      console.log("error in placeOrder function:", error)
    }
  }
}

module.exports = OrderController;
  