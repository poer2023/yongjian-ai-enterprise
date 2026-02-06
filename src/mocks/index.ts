// Unified exports for all mock data

// bidDocSkeleton exports (rename Material to avoid conflict)
export {
  type OutlineItem,
  type Material as BidDocMaterial,
  type MaterialDetail,
  type EnterpriseMaterial,
  type ManualUpload,
  mockContents,
  scoringPoints,
  recommendedMaterials,
  materialDetails,
  enterpriseMaterialsData,
  manualUploadsData,
  outlineItemsData,
} from './bidDocSkeleton';

// enterpriseMaterial exports
export {
  type KeyValuePair,
  type SourceFile,
  type Material,
  type FilePreview,
  type Folder,
  filePreviewData,
  folders,
  files,
  materials,
  getCategoryColor,
} from './enterpriseMaterial';

// legalSearch exports
export * from './legalSearch';
