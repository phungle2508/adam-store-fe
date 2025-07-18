"use server";

import {
  fetchCartItemByIdApi,
  createCartItemApi,
  updateCartItemApi,
  deleteCartItemApi
} from "@/lib/data/cartItem";
import { fetchCartItemsApi } from "@/lib/data/cart";
import type { ActionResponse } from "@/lib/types/actions";
import { extractErrorMessage } from "@/lib/utils";
import { TCartItem } from "@/types";

/**
 * Fetch all cart items for the current user (paginated).
 */
export async function fetchCartItemsAction(page?: number, size?: number, sort?: string[]): Promise<ActionResponse<TCartItem[]>> {
  try {
    const items = await fetchCartItemsApi(page, size, sort);
    return { success: true, data: items };
  } catch (error) {
    const extracted = extractErrorMessage(error, "Failed to fetch cart items.");
    return { success: false, message: extracted.message, apiError: extracted };
  }
}

/**
 * Add a new cart item using API.
 */
export async function addToCartAction(
  userId: string,
  productId: string,
  quantity: number,
  color: string,
  size: number,
) {
  try {
    // The API expects a cartItemRequest object
    const cartItemRequest = {
      userId,
      productId,
      quantity,
      color,
      size,
    };
    if (color == undefined) cartItemRequest.color = "blue"; {

    }
    const item = await createCartItemApi(cartItemRequest);



    return { status: 200, message: "New product added in your cart", cartItem: null };
  } catch (error) {
    return { status: 500, message: "Server error", error };
  }
}

export async function getCartItemsAction(userId: string) {
  try {
    // No userId filter in API, so just fetch all for current user
    const items = await fetchCartItemsApi();
    return { status: 200, cart: items };
  } catch (error) {
    return { status: 500, error };
  }
}

export async function changeCartItemQuantityAction(
  cartItemId: string,
  quantity: number,
) {
  try {
    const cartItemUpdateRequest = { quantity };
    const item = await updateCartItemApi(Number(cartItemId), cartItemUpdateRequest);
    // Optionally, fetch all items again for updated cart
    const items = await fetchCartItemsApi();
    return { status: 204, cart: items };
  } catch (error) {
    return { status: 500, error };
  }
}

export async function deleteCartItemAction(cartItemId: string) {
  try {
    await deleteCartItemApi(Number(cartItemId));
    const items = await fetchCartItemsApi();
    return { status: 202, message: "Cart item deleted", cart: items };
  } catch (error) {
    return { status: 500, error };
  }
}

export async function deleteAllCartItemsAction(userId: string) {
  try {
    // No bulk delete in API, so fetch all and delete one by one
    const items = await fetchCartItemsApi();
    const userItems = items.filter(item => item.userId === userId);
    await Promise.all(userItems.map(item => deleteCartItemApi(Number(item.id))));
    return { status: 204, message: "The shopping cart is empty" };
  } catch (error) {
    return { status: 500, error, message: "There is a problem" };
  }
}

export async function changeCartItemSizeAction(
  cartItemId: string,
  size: number,
) {
  try {
    const cartItemUpdateRequest = { size };
    const item = await updateCartItemApi(Number(cartItemId), cartItemUpdateRequest);
    const items = await fetchCartItemsApi();
    return { status: 202, cart: items };
  } catch (error) {
    return { status: 500, error };
  }
}

export async function changeCartItemColorAction(
  cartItemId: string,
  color: string,
) {
  try {
    const cartItemUpdateRequest = { color };
    const item = await updateCartItemApi(Number(cartItemId), cartItemUpdateRequest);
    const items = await fetchCartItemsApi();
    return { status: 202, cart: items };
  } catch (error) {
    return { status: 500, error };
  }
}

export async function checkoutAction(address: string) {
  // Not implemented: No checkout/order API in cartItem.ts or cart.ts
  return { status: 501, message: "Checkout API not implemented" };
}

export async function getCart(userId: string) {
  // Just fetch all items for the current user
  try {
    const items = await fetchCartItemsApi();
    return items.filter(item => item.userId === userId);
  } catch (error) {
    return [];
  }
}
