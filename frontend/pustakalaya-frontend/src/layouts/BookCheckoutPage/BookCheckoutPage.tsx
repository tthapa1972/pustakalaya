import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarReview } from "../Utils/StarReview";
import { CheckoutAndReview } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { error } from "console";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckOutPage = () => {
    
    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Review State
    const [reviews, setReviews] = useState<ReviewModel[]>();
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(false);

    //Loans count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //is book checkedout?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedout, setisLoadingBookCheckedout] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];


    //fetch reviews 
    useEffect(() => {
        const fetchBooks = async () => {

            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;


            const url: string = `${baseUrl}?page=0&size=9`;

            console.log(url);

            const response = await fetch(url);


            if (!response.ok) {
                throw new Error('Error while fetching books');
            }

            const responseJson = await response.json();

            console.log(responseJson);

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
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {

            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            console.log(reviewUrl);

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Error while fetching books');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            console.log(responseData);

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }
            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        };
        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = 'http://localhost:8080/api/books/secure/currentloans/count';
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };

                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }

        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })

    }, [authState, isCheckedOut])

    useEffect(() => {

        const fetchUserCheckedoutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/isCheckedOut/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };

                const bookCheckedOut = await fetch(url, requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong');
                }
                const bookCheckedOutJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutJson);
            }

            setisLoadingBookCheckedout(false);
        }

        fetchUserCheckedoutBook().catch((error: any) => {
            setisLoadingBookCheckedout(false);
            setHttpError(error.message);
        })

    }, [authState])

    useEffect(() => {

        const fetchUserReviewBook = async () => {

            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };

                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewJson = await userReview.json();
                setIsReviewLeft(userReviewJson);

            }
            setIsLoadingUserReview(false);

        }

        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })

    }, [authState])

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedout || isLoadingReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {

        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'

            }
        };

        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong');
        }
        setIsCheckedOut(true);

    }

    async function submitReview(starInput : number, reviewDescription: string) {

        let bookId: number = 0;
        if(book?.id){
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        const reviewOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(reviewRequestModel)
        }

        const returnResponse = await fetch(url, reviewOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong');
        }
        setIsReviewLeft(true);
        
    }

    return (
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
                            <StarReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReview book={book} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews!} bookId={book?.id} mobile={false} />
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
                        <StarReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReview book={book} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews!} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );

}
