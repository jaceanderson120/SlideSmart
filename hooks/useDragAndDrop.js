const useDragAndDrop = (studyGuide, setStudyGuide) => {
  const reorderExtractedData = (order) => {
    setStudyGuide((prev) => {
      const reorderedData = {};
      order.forEach((key) => {
        if (prev.extractedData[key]) {
          reorderedData[key] = prev.extractedData[key];
        }
      });
      return {
        ...prev,
        extractedData: reorderedData,
      };
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(Object.keys(studyGuide.extractedData));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderExtractedData(items);
  };

  return handleDragEnd;
};

export default useDragAndDrop;
