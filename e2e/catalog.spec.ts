import { test, expect } from "@playwright/test";

test("search, open a product and add it to the bag", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  await page.getByLabel("Search products").fill("overcoat");
  await expect(page.getByTestId("product-card")).toHaveCount(1);

  await page.getByTestId("product-card").click();
  await expect(page.getByRole("heading", { name: "Wool Overcoat" })).toBeVisible();

  const addButton = page.getByRole("button", { name: "Add to bag" });
  await expect(addButton).toBeDisabled();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await addButton.click();

  await expect(page.getByRole("status")).toContainText("Added to your bag.");
  await expect(page.getByLabel("Bag, 1 items")).toBeVisible();
});

test("shows the empty state and recovers", async ({ page }) => {
  await page.goto("/?q=zzzz");
  await expect(page.getByText("No products match your filters")).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).first().click();
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});

test("wishlist, checkout as a guest and view the order", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Save Heavyweight Tee to wishlist" }).click();
  await page.getByRole("link", { name: /Wishlist/ }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(1);

  await page.getByTestId("product-card").getByRole("link").click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("link", { name: "View bag" }).click();
  await page.getByRole("link", { name: "Go to checkout" }).click();

  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page.getByText("Required").first()).toBeVisible();

  await page.getByLabel("Full name").fill("Mia Keller");
  await page.getByLabel("Email").fill("mia@example.com");
  await page.getByLabel("Address").fill("Hauptstrasse 1");
  await page.getByLabel("City").fill("Berlin");
  await page.getByLabel("Postcode").fill("10115");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByText("Thank you, your order is placed")).toBeVisible();
  await expect(page.getByLabel("Bag, 0 items")).toBeVisible();
});

test("register and see order history", async ({ page }) => {
  const email = `user${Date.now()}@example.com`;
  await page.goto("/account");
  await page.getByRole("button", { name: "New here? Create an account" }).click();
  await page.getByLabel("Full name").fill("Mia Keller");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Hello, Mia Keller" })).toBeVisible();
  await expect(page.getByText("No orders yet")).toBeVisible();
});
