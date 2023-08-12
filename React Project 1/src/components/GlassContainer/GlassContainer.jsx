import './GlassContainer.css';

export const GlassContainer = ({ children, height }) => {

    return(
        <div className="glassMorphism" style={{ height }}>
            { children }
        </div>
    );
}