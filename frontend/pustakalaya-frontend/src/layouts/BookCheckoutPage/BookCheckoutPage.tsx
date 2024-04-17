import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarReview } from "../Utils/StarReview";
import { CheckoutAndReview } from "./CheckoutAndReviewBox";

export const BookCheckOutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect( () => {
        const fetchBooks = async () => {

            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;
            const url: string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url);

            if(!response.ok){
                throw new Error('Error while fetching books');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                    id: responseJson.id,
                    title: responseJson.title,
                    author: responseJson.author,
                    description: responseJson.description,
                    copies: responseJson.copies,
                    copiesAvailable: responseJson.copiesAvailable,
                    category: responseJson.category,
                    img: responseJson.img
            };


            setBook(loadedBook);
            setIsLoading(false);

        }
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    if(isLoading){
        return(
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return(
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarReview rating={2.5} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReview book={book} mobile={false}/>
                </div>
                <hr />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarReview rating={2.5} size={32}/>
                    </div>
                </div>
                <CheckoutAndReview book={book} mobile={false}/>
                <hr />
            </div>
        </div>
    );

}