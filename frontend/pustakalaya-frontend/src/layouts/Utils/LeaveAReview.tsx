import React, { useState } from "react";
import { StarReview } from "./StarReview";

export const LeaveAReview: React.FC<{}> = (props) => {

    const [startInput, setStarInput] = useState(0);

    function startValue(value: number){
        setStarInput(value);
    }

    return(
        <div className="dropdown" style={{ cursor: 'pointer'}}>
            <h5 className="dropdown-toggle" id='dropdownMenuButton1' data-bs-toggle='dropdown'>
                Leave a review?
            </h5>
            <ul id="submitReviewRating" className='dropdown-menu' aria-labelledby="dropdownMenuButton1"> 
                <li> <button onClick={() => startValue(0)} className="dropdown-item">0 star</button> </li>
                <li> <button onClick={() => startValue(0.5)} className="dropdown-item">0.5 star</button> </li>
                <li> <button onClick={() => startValue(1)} className="dropdown-item">1 star</button> </li>
                <li> <button onClick={() => startValue(1.5)} className="dropdown-item">1.5 star</button> </li>
                <li> <button onClick={() => startValue(2)} className="dropdown-item">2 star</button> </li>
                <li> <button onClick={() => startValue(2.5)} className="dropdown-item">2.5 star</button> </li>
                <li> <button onClick={() => startValue(3)} className="dropdown-item">3 star</button> </li>
                <li> <button onClick={() => startValue(3.5)} className="dropdown-item">3.5 star</button> </li>
                <li> <button onClick={() => startValue(4)} className="dropdown-item">4 star</button> </li>
                <li> <button onClick={() => startValue(4.5)} className="dropdown-item">4.5 star</button> </li>
                <li> <button onClick={() => startValue(5)} className="dropdown-item">5 star</button> </li>
            </ul>
            <StarReview rating={startInput} size={32}/>
        </div>
    );
}