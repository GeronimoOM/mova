import classNames from 'classnames';

export interface PageWithSidebarProps {
    mainContent: React.ReactNode;
    sidebarContent: React.ReactNode;
    isSidebarOpen: boolean;
}

export const PageWithSidebar: React.FC<PageWithSidebarProps> = ({
    mainContent,
    sidebarContent,
    isSidebarOpen,
}) => {
    return (
        <div
            className={classNames(
                'relative transition-all',
                {
                    'mr-[18rem] lg:mr-[24rem] xl:mr-[30rem] 2xl:mr-[36rem]': isSidebarOpen,
                },
            )}
        >
            {mainContent}

            {isSidebarOpen && sidebarContent}
        </div>
    );
}