import {
    GiBrickWall, GiStoneBlock, GiPaintBucket, GiTap,
    GiElectric, GiCrane, GiDrill, GiConcreteBag
} from 'react-icons/gi';
import { FaTools, FaHardHat, FaTruck } from 'react-icons/fa';
import { MdConstruction } from 'react-icons/md';

export const CATEGORIES = [
    { id: 'materials', label: 'Materials', icon: null }, // Header
    { id: 'bricks', label: 'Bricks', icon: GiBrickWall, type: 'product' },
    { id: 'cement', label: 'Cement', icon: GiConcreteBag, type: 'product' },
    { id: 'sand', label: 'Sand/Stone', icon: GiStoneBlock, type: 'product' },
    { id: 'paint', label: 'Paints', icon: GiPaintBucket, type: 'product' },
    { id: 'plumbing', label: 'Plumbing', icon: GiTap, type: 'product' },
    { id: 'electrical', label: 'Electrical', icon: GiElectric, type: 'product' },

    { id: 'services', label: 'Services', icon: null }, // Header
    { id: 'mason', label: 'Mason', icon: MdConstruction, type: 'service' },
    { id: 'plumber', label: 'Plumber', icon: FaTools, type: 'service' },
    { id: 'electrician', label: 'Electrician', icon: GiElectric, type: 'service' },
    { id: 'painter', label: 'Painter', icon: GiPaintBucket, type: 'service' },

    { id: 'machines', label: 'Machines', icon: null }, // Header
    { id: 'jcb', label: 'JCB', icon: FaTruck, type: 'machine' },
    { id: 'crane', label: 'Crane', icon: GiCrane, type: 'machine' },
    { id: 'borewell', label: 'Borewell', icon: GiDrill, type: 'machine' },
];
