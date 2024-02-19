/*********** EXPORTS **************/
import db from '../models/connection'
import utils from "../utils/utils";
import responseMessages from '../utils/messages/global.messages'
//import ProductModel from '../models/models/products.models'
import { Request, Response } from 'express'
import { compareSync } from 'bcrypt';

/*********** CONSTANTS **************/
const Products = db.products;

/**
 * Find all products
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
export const findAll = (req: any & Request, res: Response) => {
  // Check parameters
  const user = req.aux;

  // Find all
  console.log(user)
  if (user.role === 2) { // Admin
    Products.findAll()
      .then((data: typeof Products) => {
        if (data.length > 0)  return res.status(200).send(data);
        else return res.status(204).send(responseMessages[204].NO_CONTENT);
      })
      .catch((error: any) => {
        console.error(`Error: `, error);
        res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
      })
  } else if (user.role === 1) { // User
    Products.findAll({ where: { user_id: user.id } })
      .then((data: typeof Products) => {
        if (data.length > 0)  return res.status(200).send(data)
        else return res.status(204).send(responseMessages[204].NO_CONTENT)
      })
      .catch((error: any) => {
        console.error(`Error: `, error);
        res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
      })
  }
}

/**
 * Find a single product with an id
 * @param  {object} req   request received in handler
 * @param  {object} res   response in handler
 */
export const findOne = (req: any, res: Response) => {
  // Check parameters
  const user = req.aux;
  const params = req.params;
  let id: number;

  if (!params) return res.status(400).send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY);
  if (!params.id) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);
  else  id = params.id;

  // Find one
  if (user.role === 2) { // Admin
    Products.findOne({ where: { id: id } })
    .then((data: typeof Products) => {
      if (data) return res.status(200).send(data)
      else return res.status(404).send(responseMessages[404].NOT_FOUND)
    })
    .catch((error: any) => {
      console.error(`Error: `, error);
      res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    })
  } else if (user.role === 1) { // User
    Products.findOne({ where: { id: id, user_id: user.id } })
    .then((data: typeof Products) => {
      if (data) return res.status(200).send(data)
      else return res.status(404).send(responseMessages[404].NOT_FOUND)
    })
    .catch((error: any) => {
      console.error(`Error: `, error);
      res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    })
  } else {
    res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
  }
}

export const createProduct = (req: any, res: Response) => {
  // Check parameters
  const user = req.aux;
  const body = req.body;
  console.log(Object.keys(body).length)
  console.log(!body || Object.keys(body).length)
  if (!body || Object.keys(body).length == 0)
    return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY);
  if (!utils.keysChecker(body, ["name", "description"]))
    return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

  // Create
  Products.findOne({ where: { user_id: user.id, name: body.name } })
    .then((data: any) => {
      if (data) return res.status(400).send(responseMessages[400].ALREADY_EXISTS);
      else {
        const temp = {
          name: body.name,
          user_id: user.id,
          description: body.description,
        }

        Products.create(temp)
          .then((data: typeof Products) => {
            return res.status(201).send(responseMessages[201].CREATED_SUCCESSFULLY)
          })
          .catch((error: any) => {
            console.error(error);
            return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
          })
      }
    })
    .catch((error: any) => {
      console.error(`Error: `, error);
      res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
    })
}

export const updateProduct = (req: any, res: Response) => {
  // Check parameters
  const user = req.aux;
  const params = req.params;
  const body = req.body;
  let id: number;

  if (!params) return res.status(400).send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY)
  if (!body || Object.keys(body).length == 0) return res.status(400).send(responseMessages[400].BODY_CANNOT_BE_EMPTY)
  if (!params.id) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS)
  else  id = params.id;
  if (!utils.keysChecker(body, ["name", "description"]))
    return res.status(400).send(responseMessages[400].MISSING_PARAMETERS);

  // Update
  const temp = {
    name: body.name,
    description: body.description,
  }

    if (user.role === 2) { // Admin
      Products.update(temp, {
        where: { id: id },
      })
        .then((rows_affedted: number) => {
          if (rows_affedted == 1) return res.status(200).send(responseMessages[200].UPDATED_SUCCESSFULLY)
          else  return res.status(409).send(responseMessages[409].CONFLICT_UPDATE)
        })
        .catch((error: any) => {
          console.error(`Error: `, error);
          res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
        })
    } else if (user.role === 1) { // User
      Products.update(temp, {
        where: { id: id, user_id: user.id },
      })
        .then((rows_affedted: number) => {
          if (rows_affedted == 1) return res.status(200).send(responseMessages[200].UPDATED_SUCCESSFULLY)
          else  return res.status(409).send(responseMessages[409].CONFLICT_UPDATE)
        })
        .catch((error: any) => {
          console.error(`Error: `, error);
          res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR);
        })
    } else {
      return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
    }
}

export const deleteProduct = (req: any, res: Response) => {
  // Check parameters
  const user = req.aux;
  const params = req.params;
  let id: string;

  if (!params) return res.status(400).send(responseMessages[400].PARAMS_CANNOT_BE_EMPTY)
  if (!params.id) return res.status(400).send(responseMessages[400].MISSING_PARAMETERS)
  else  id = params.id;

  // Delete
  if (user.role === 2) { // Admin
    Products.findByPk(id)
    .then((product: typeof Products) => {
      if (!product) return res.status(404).send(responseMessages[404].NOT_FOUND);
      
      product.destroy()
      .then((rows_affedted: number) => {
        if (rows_affedted == 1) return res.status(200).send(responseMessages[200].DELETED_SUCCESSFULLY);
        else return res.status(403).send(responseMessages[403]. FORBIDDEN_DELETE);
      })
      .catch((error: any) => {
        console.error(`Error: `, error);
        return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
      })
    })
    .catch((error: any) => {
      console.error(`Error: `, error);
      return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
    })
  } else if (user.role === 1) { // User
    Products.findOne({ where: { id: id, user_id: user.id } })
    .then((data: typeof Products) => {
      if (!data) return res.status(404).send(responseMessages[404].NOT_FOUND);

      Products.destroy({ where: { id: id, user_id: user.id } })
      .then((rows_affedted: number) => {
        if (rows_affedted == 1) return res.status(200).send(responseMessages[200].DELETED_SUCCESSFULLY);
        else return res.status(403).send(responseMessages[403].FORBIDDEN_DELETE);
      })
      .catch((error: any) => {
        console.error(`Error: `, error);
        return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
      })
    })
    .catch((error: any) => {
      console.error(`Error: `, error);
      return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
    })
  } else {
    return res.status(500).send(responseMessages[500].INTERNAL_SERVER_ERROR)
  }
}
