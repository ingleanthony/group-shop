const { UserInputError } = require("apollo-server-errors");

const { item_validation } = require("../../../util/validation");

module.exports = {
  add_item: async (_, { name, listID, userID }, { pubsub }) => {
    // validation
    const { valid, errors, list, user } = await item_validation({
      name,
      listID,
      userID,
    });
    if (!valid) throw new UserInputError("Add Item Error", { errors });

    // adds the item to the list and overwrites the list in the database
    list.items.push({
      name,
      member: null,
      purchased: false,
    });
    const updated_list = await list.save();

    // sends an update to everyone in the list containing the added item
    pubsub.publish(updated_list.code, {
      item_updates: {
        type: "add",
        affector: user.screen_name,
        item: {
          id: updated_list.items[updated_list.items.length - 1]._id,
          ...updated_list.items[updated_list.items.length - 1]._doc,
        },
      },
    });

    return {
      id: updated_list.items[updated_list.items.length - 1]._id,
      ...updated_list.items[updated_list.items.length - 1]._doc,
    };
  },
  remove_item: async (_, { listID, itemID, userID }, { pubsub }) => {
    // validation
    const { valid, errors, list, user, item_index } = await item_validation({
      listID,
      itemID,
      userID,
    });
    if (!valid) throw new UserInputError("Remove Item Error", { errors });

    const item = list.items[item_index];

    // removes the item at the specified index and overwrites the list in the database
    list.items.splice(item_index, 1);
    const updated_list = await list.save();

    // sends an update to everyone in the list containing the removed item
    pubsub.publish(updated_list.code, {
      item_updates: {
        type: "remove",
        affector: user.screen_name,
        item: {
          id: item._id,
          ...item._doc,
        },
      },
    });

    return {
      id: item._id,
      ...item._doc,
    };
  },
  claim_item: async (
    _,
    { listID, itemID, userID, method = "claim" },
    { pubsub }
  ) => {
    // validation
    const { errors, valid, list, user, item_index } = await item_validation({
      listID,
      itemID,
      userID,
      method,
    });
    if (!valid) throw new UserInputError("Item Claim Error", { errors });

    // updates whether the item is claimed or not based on the method
    if (method == "claim") list.items[item_index].member = user.screen_name;
    else if (method == "unclaim") list.items[item_index].member = null;

    // overwrites the list in the database
    const updated_list = await list.save();

    // sends an update to everyone in the list containing the item that was claimed/unclaimed
    pubsub.publish(updated_list.code, {
      item_updates: {
        type: method == "claim" ? "claim" : "unclaim",
        affector: user.screen_name,
        item: {
          id: updated_list.items[item_index]._id,
          ...updated_list.items[item_index]._doc,
        },
      },
    });

    return {
      id: updated_list.items[item_index]._id,
      ...updated_list.items[item_index]._doc,
    };
  },
  purchase_item: async (
    _,
    { listID, itemID, userID, method = "purchase" },
    { pubsub }
  ) => {
    // validation
    const { errors, valid, list, user, item_index } = await item_validation({
      listID,
      itemID,
      userID,
      method,
    });
    if (!valid) throw new UserInputError("Purchase Error", { errors });

    // updates whether the item is purchased or not based on the method
    if (method == "purchase") list.items[item_index].purchased = true;
    else if (method == "unpurchase") list.items[item_index].purchased = false;

    // overwrites the list in the database
    const updated_list = await list.save();

    // sends an updated to everyone in the list containing the item that was purchased/unpurchased
    pubsub.publish(updated_list.code, {
      item_updates: {
        type: method == "purchase" ? "purchase" : "unpurchase",
        affector: user.screen_name,
        item: {
          id: updated_list.items[item_index]._id,
          ...updated_list.items[item_index]._doc,
        },
      },
    });

    return {
      id: updated_list.items[item_index]._id,
      ...updated_list.items[item_index]._doc,
    };
  },
};