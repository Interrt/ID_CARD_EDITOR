import { GoGoal } from "react-icons/go";
import { MdCenterFocusStrong } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { FaEye,FaRegStar } from "react-icons/fa";
import "./designlist.css";
function DesignTips() {
  return (
    <>
    <div className="">
        <div>
            <h1 className="m-3">Design Tips</h1>
        </div>
        <div className="my-3 design_text">
            <div>
                <div className="d-flex"><GoGoal className="m-2"/><h3>Match the Purpose</h3></div>
                
            <ul className="m-3">
                <li>School/College: Use bright, friendly colors with student info prominently visible.</li>
                <li>Corporate/Startup: Go with minimalistic or elegant styles, aligned with your brand.</li>
                <li>Event/Visitor Pass: Use bold fonts and high-contrast designs for easy readability.</li>
            </ul>
            </div>
            <div>
                <div className="d-flex"><MdCenterFocusStrong className="m-2"/><h3>Focus on Readability</h3></div>
            <ul className="m-3">
                <li>Use clean fonts: Avoid overly decorative typefaces.</li>
                <li>Ensure contrast: Dark text on light backgrounds improves clarity.</li>
                <li>Keep details simple: Display only essential info like Name, Role, and ID Number.</li>
            </ul>
            </div>
            <div>
                <div className="d-flex"><IoIosColorPalette className="m-2"/><h3>Align with Your Brand</h3></div>
            <ul className="m-3">
                <li>Pick templates that match your brand’s color palette and logo theme.</li>
                <li>Consistency builds trust and professionalism.</li>
            </ul>
            </div>
            <div>
                <div className="d-flex"><FaEye className="m-2"/><h3>Preview Before Selecting</h3></div>
            <ul className="m-3">
                <li>Use the Preview button to see how your data looks on different templates.</li>
                <li>Zoom in/out or switch views (front/back) for a complete perspective.</li>
                
            </ul>
            </div>
            <div>
                <div className="d-flex"><FaRegStar className="m-2"/><h2> Pro Tip</h2></div>
                <p className="mx-3">Your ID card is a representation of your identity—keep it clean, consistent, and clear.</p>
            </div>

            
        </div>
    </div>
    </>
  )
}

export default DesignTips