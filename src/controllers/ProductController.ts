import {Request, Response, NextFunction} from 'express';
import * as express from 'express';
import validationMiddleware from '../middlewares/vallidation';
import ProductDto from '../models/product/product.dto';
import { AuthMiddleware } from '../middlewares/auth';
import Product from '../models/product/product.interface';
import userModel from '../models/user/user.schema';
import HttpException from '../utils/httpException';
import productModel from '../models/product/product.schema';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export default class ProductController{

    public path = '/products';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/create`, AuthMiddleware, validationMiddleware(ProductDto), this.create);
        this.router.put(`${this.path}/update/:uuid`, AuthMiddleware, validationMiddleware(ProductDto, true), this.update);
        this.router.delete(`${this.path}/delete/:id`, AuthMiddleware, this.delete);
        this.router.get(`${this.path}/list`, AuthMiddleware, this.listAll);
        this.router.get(`${this.path}/count`, AuthMiddleware, this.getCountDocuments);
    }

    listAll = async (req:Request, res: Response, next: NextFunction) => {
        console.log("entrando -------------------------");
        
        const filterName = req.query.name;
        const filterDescription = req.query.description;
        const filterCategory = req.query.category;
        const uuid = String(req.query.uuid);
        console.log(uuid);
        

        const limit = Number(req.query.limit) | 0;
        const offset = Number(req.query.offset) | 0;
        
        
        let filterObject = {};

        if(filterName)
            filterObject = {...filterObject, name: {$regex: filterName, $options: 'i'}};

        if(filterDescription)
            filterObject = {...filterObject, description: {$regex: filterDescription, $options: 'i'}};
            
        if(filterCategory)
            filterObject = {...filterObject, category: {$regex: filterCategory, $options: 'i'}};


        const user = await userModel.findOne({uuid: uuid});
        if(!user)
            return next(new HttpException(400, `User with uuid ${uuid} not exist`));

        filterObject = {...filterObject, user: user._id};

        logger.info(`research carried out successfully`);
        const products = await productModel.find(filterObject).skip(offset).limit(limit);
        const countProducts = await productModel.countDocuments({...filterObject});
        console.log(countProducts);
        
        
        res.send({products: products, count: countProducts});
    };


    getCountDocuments = async (req:Request, res: Response, next: NextFunction) => {

        const uuid = String(req.query.uuid);
        const user = await userModel.findOne({uuid: uuid});
        if(!user)
            return next(new HttpException(400, `User with uuid ${uuid} not exist`));


        productModel.countDocuments({user: user._id},(err, count) => {
            if(count){
                logger.info('Operation Success to get the number of documents');
                return res.send({data: count});
            }
            if(err)
                return next(new HttpException(400, `error when try to get number of the documentos. Details: ${err}`));
        })
       
        

      
    };


    create = async (req:Request, res: Response, next: NextFunction) => {
        
        const productData: Product = req.body;
        console.log(productData);
        
        
        const user = await userModel.findOne({ uuid: productData.uuid});
        console.log(user);
        
        
        if(!user)
            return next(new HttpException(400, `User with uuid ${productData.user} not found`));

        productData.user = user._id;
        productData.uuid = uuidv4();
        const createdProduct = new productModel(productData);
        createdProduct.save().then(savedProduct => {
            logger.info(`User ${user.name} successfully created the product ${savedProduct.name}`);
            return res.status(200).send(savedProduct);
        }).catch(err => {
            return next(new HttpException(400, `error when creating the product ${productData.name} by the user ${user.name}. Details: ${err}`));
        });

    };

    
    update = async (req:Request, res: Response, next: NextFunction) => {

        const uuidProduct = req.params.uuid;
        
        
        const productData: Product = req.body;
        
        const user = await userModel.findOne({ uuid: productData.user});
        const product = await productModel.findOne({ uuid: uuidProduct});

        console.log(user);
        console.log(product);
        
        productData.uuid = uuidProduct;
        productData.user = user._id;
        
        if(!user)
            return next(new HttpException(400, `User with uuid ${user.uuid} not exist`));


        if(!product)
            return next(new HttpException(400, `Product with uuid ${product.uuid} not found`));


        const productUpdated = await productModel.findByIdAndUpdate(product._id, productData, {new: true}, (err, response) => {
            if(!err){
                logger.info(`User successfully updated the product`);
                return res.send({message: "success"});
            }
            if(!response)
                next(new HttpException(400, err));
        });
        
        
    };

    
    delete = async (req:Request, res: Response, next: NextFunction) => {
        
        const id = req.params.id;
        const product = await productModel.findById(id);
        if(!product)
            return next(new HttpException(400, `Product with uuid ${id} not found`));

        await productModel.findByIdAndDelete(id, (err, res) => {
            if(err)
                return next(new HttpException(400, `Error when trying to delete product: ${err}`));

        });
        logger.info(`Product ${product.name} successfully deleted`);
        res.status(200).send({message: 'Success'})

    };

    private pagination = (numPag: number, limit: number) => {
        return (limit * (numPag - 1));
    }


}