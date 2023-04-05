import './currencyData.mock';
import './documentCreateRange.mock';
import './matchMedia.mock';
import './stripesConfig.mock';
import './stripesCore.mock';
import './stripesIcon.mock';
import './stripesSmartComponents.mock';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 500, width: 500 }));
