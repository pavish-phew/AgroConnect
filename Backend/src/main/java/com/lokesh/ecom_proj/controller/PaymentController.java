package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.task.configurer;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.exception.StripeException;
import com.stripe.Stripe; // Make sure you import the Stripe library
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class PaymentController {

    // Set the Stripe secret API key here
    private static String apikey = configurer.getStripeApikey();
    static {
        Stripe.apiKey = apikey;
    }

    // Stripe Checkout Session creation method
    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestBody CreateCheckoutSessionRequest request) {
        System.out.println("Payment Controller!");

        // Validate the products in the request
        if (request.getProducts() == null || request.getProducts().isEmpty()) {
            return Map.of("error", "Products array is required.");
        }

        // Create the line items for Stripe checkout
        List<SessionCreateParams.LineItem> lineItems = request.getProducts().stream()
                .map((Product product) -> {
                    return SessionCreateParams.LineItem.builder()
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("usd")
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(product.getName())
                                                            .addImage(product.getImageName()) // Correct usage: addImage
                                                            .build())
                                            .setUnitAmount((long) (product.getPrice() * 100)) // Convert price to cents
                                            .build())
                            .setQuantity((long) product.getStockQuantity()) // Quantity from stockQuantity
                            .build();
                })
                .collect(Collectors.toList());

        try {
            // Create SessionCreateParams with lineItems and updated method
            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD) // Correct usage for adding
                                                                                      // payment method type
                    .addAllLineItem(lineItems) // Correct method name: addAllLineItems
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/success") // Replace with your actual success URL
                    .setCancelUrl("http://localhost:5173/failure") // Replace with your actual cancel URL
                    .build();

            // Create the checkout session using the params
            System.out.println("Received Products: " + request.getProducts());
            Session session = Session.create(params);

            // Inside try-catch block when creating session:
            System.out.println("Created Session ID: " + session.getId());

            // Return the session ID
            return Map.of("id", session.getId());
        } catch (StripeException e) {
            e.printStackTrace(); // Log the exception for debugging purposes
            return Map.of("error", "Internal Server Error");
        }
    }
}
