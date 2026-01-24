
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { saveAsset, getAllAssets, deleteAsset, Asset } from '../../utils/assetStore';
import { TrashIcon, ImageIcon, DownloadIcon } from '../Icons';

interface AssetPanelProps {
    onSelect: (file: File) => void;
}

const AssetPanel: React.FC<AssetPanelProps> = ({ onSelect }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        setIsLoading(true);
        try {
            const items = await getAllAssets();
            setAssets(items.sort((a, b) => b.createdAt - a.createdAt));
        } catch (e) {
            console.error("Failed to load assets", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await saveAsset(e.target.files[0]);
            loadAssets();
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteAsset(id);
        loadAssets();
    };

    const handleSelect = (asset: Asset) => {
        // Reconstruct File object from Blob
        const file = new File([asset.blob], asset.name, { type: asset.type });
        onSelect(file);
    };

    return (
        <div className="asset-panel">
            <div className="asset-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon />
                <span>Upload New Asset</span>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{display: 'none'}} 
                    onChange={handleUpload} 
                />
            </div>
            
            <div className="asset-list-label">Saved Assets</div>
            
            {isLoading ? (
                <div className="loading-state">Loading library...</div>
            ) : assets.length === 0 ? (
                <div className="empty-state-text">No assets saved yet.</div>
            ) : (
                <div className="asset-grid">
                    {assets.map(asset => (
                        <div key={asset.id} className="asset-item" onClick={() => handleSelect(asset)}>
                            <div className="asset-preview">
                                <img src={URL.createObjectURL(asset.blob)} alt={asset.name} />
                            </div>
                            <div className="asset-info">
                                <span className="asset-name">{asset.name}</span>
                                <button className="asset-delete" onClick={(e) => handleDelete(asset.id, e)}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssetPanel;
