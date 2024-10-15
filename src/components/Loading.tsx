import LoadingIcon from "@/components/Base/LoadingIcon";
import logoUrl from "@/assets/images/logo.png";

export const LoadingTag = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-end">
                <LoadingIcon icon="ball-triangle" className="w-8 h-8" />
                <img
                    alt="Qaretech Innovative"
                    className="w-30 h-10"
                    src={logoUrl}
                />
            </div>
        </div>
    );
};
