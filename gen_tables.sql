DROP TABLE IF EXISTS photo_info;

CREATE TABLE photo_info AS
SELECT
    zAsset.zuuid AS zuuid,
    zasset.z_pk AS asset_zpk,
    zperson.z_pk AS person_zpk,
    DATETIME(zAsset.ZDATECREATED + 978307200, 'UNIXEPOCH') AS 'date_created',
    zExtAttr.ZLATITUDE AS 'latitude',
    zExtAttr.ZLONGITUDE AS 'longitude',
    zExtAttr.ZCAMERAMAKE AS 'camera_make',
    zExtAttr.ZCAMERAMODEL AS 'camera_model',
    zExtAttr.ZLENSMODEL AS 'lens_model',
    zExtAttr.ZDURATION AS 'video_duration',
    zAddAssetAttr.ZVIEWCOUNT AS 'view_count',
    zPerson.ZFACECOUNT AS 'face_count',
    zPerson.ZPERSONUUID AS 'person_uuid',
    zPerson.ZDISPLAYNAME AS 'display_name',
    zPerson.ZFULLNAME AS 'full_name',
    zasset.zsorttoken AS zsorttoken,
    CASE
        zDetFace.ZVIPMODELTYPE
        WHEN 0
            THEN 'Not VIP'
        WHEN 1
            THEN 'VIP'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZVIPMODELTYPE || ''
    END AS 'zdet_vip_model',
    zDetFace.ZFACEALGORITHMVERSION AS 'zdet_algo_version',
    zDetFace.ZADJUSTMENTVERSION AS 'zdet_adjustment_version',
    zDetFace.ZCLUSTERSEQUENCENUMBER AS 'zdet_cluster_sequence_number',
    zDetFace.ZGROUPINGIDENTIFIER AS 'zdet_grouping_id',
    zDetFace.ZMASTERIDENTIFIER AS 'zdet_master_id',
    zDetFace.ZCENTERX AS 'zdet_center_x',
    zDetFace.ZCENTERY AS 'zdet_center_y',
    CASE
        zDetFace.ZGENDERTYPE
        WHEN 0
            THEN 'unknown'
        WHEN 1
            THEN 'Male'
        WHEN 2
            THEN 'Female'
        ELSE 'Unknown-New-Value!: ' || zPerson.ZGENDERTYPE || ''
    END AS 'gender_estimate',
    CASE
        zPerson.ZAGETYPE
        WHEN 0
            THEN 'unknown'
        WHEN 1
            THEN 'Infant/Toddler'
        WHEN 2
            THEN 'Toddler/Child'
        WHEN 3
            THEN 'Child/Young Adult'
        WHEN 4
            THEN 'Young Adult/Adult'
        WHEN 5
            THEN 'Adult-5'
        ELSE 'Unknown-New-Value!: ' || zPerson.ZAGETYPE || ''
    END AS 'overall_age_estimate',
    CASE
        zdetface.ZAGETYPE
        WHEN 0
            THEN 'unknown'
        WHEN 1
            THEN 'Infant/Toddler'
        WHEN 2
            THEN 'Toddler/Child'
        WHEN 3
            THEN 'Child/Young Adult'
        WHEN 4
            THEN 'Young Adult/Adult'
        WHEN 5
            THEN 'Adult-5'
        ELSE 'Unknown-New-Value!: ' || zdetface.ZAGETYPE || ''
    END AS 'age_estimate',
    CASE
        zDetFace.ZETHNICITYTYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Black/African American'
        WHEN 2
            THEN 'White'
        WHEN 3
            THEN 'Hispanic/Latino'
        WHEN 4
            THEN 'Asian'
        WHEN 5
            THEN 'Native Hawaiian/Other Pacific Islander'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZETHNICITYTYPE || ''
    END AS 'ethnicity_estimate',
    CASE
        zDetFace.ZSKINTONETYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Light-Pale White Skin'
        WHEN 2
            THEN 'White-Fair Skin Tone'
        WHEN 3
            THEN 'Medium-White to Olive Skin Tone'
        WHEN 4
            THEN 'Olive-Moderate Brown Skin Tone'
        WHEN 5
            THEN 'Brown-Dark Brown Skin Tone'
        WHEN 6
            THEN 'Black-Very Dark Brown to Black Skin Tone'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZSKINTONETYPE || ''
    END AS 'skin_tone_estimate',
    CASE
        zDetFace.ZHAIRCOLORTYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Black/Brown'
        WHEN 2
            THEN 'Brown/Blonde'
        WHEN 3
            THEN 'Brown/Red'
        WHEN 4
            THEN 'Red/White'
        WHEN 5
            THEN 'Artifical'
        WHEN 6
            THEN 'White/Bald'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZHAIRCOLORTYPE || ''
    END AS 'hair_color_estimate',
    CASE
        zDetFace.ZFACIALHAIRTYPE
        WHEN 0
            THEN '0-StillTesting'
        WHEN 1
            THEN 'Clean Shaven Facial Hair Type-1'
        WHEN 2
            THEN 'Beard Facial Hair Type-2'
        WHEN 3
            THEN 'Goatee Facial Hair Type-3'
        WHEN 4
            THEN 'Mustache Facial Hair Type-4'
        WHEN 5
            THEN 'Stubble Facial Hair Type-5'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZFACIALHAIRTYPE || ''
    END AS 'zDetFace-Facial Hair Type',
    CASE
        zDetFace.ZFACIALHAIRTYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Clean Shaven'
        WHEN 2
            THEN 'Beard'
        WHEN 3
            THEN 'Goatee'
        WHEN 4
            THEN 'Mustache'
        WHEN 5
            THEN 'Stubble'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZFACIALHAIRTYPE || ''
    END AS 'facial_hair_estimate',
    CASE
        zDetFace.ZHASFACEMASK
        WHEN 0
            THEN 'No Mask'
        WHEN 1
            THEN 'Has Mask'
        WHEN 2
            THEN '2-StillTesting'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZHASFACEMASK || ''
    END AS 'face_mask_estimate',
    CASE
        zDetFace.ZFACEEXPRESSIONTYPE
        WHEN 0
            THEN 'NA'
        WHEN 1
            THEN 'Disgusted/Angry'
        WHEN 2
            THEN 'Suprised/Fearful'
        WHEN 3
            THEN 'Neutral'
        WHEN 4
            THEN 'Confident/Smirk'
        WHEN 5
            THEN 'Happiness'
        WHEN 6
            THEN 'Sadness'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZFACEEXPRESSIONTYPE || ''
    END AS 'face_expression_estimate',
    CASE
        zDetFace.ZPOSETYPE
        WHEN 0
            THEN 'other/unknown - 0'
        WHEN 1
            THEN 'Face Frontal Pose'
        WHEN 2
            THEN 'other/unknown - 2'
        WHEN 3
            THEN 'Face Profile Pose'
        WHEN 4
            THEN 'other/unknown - 4'
        WHEN 5
            THEN 'other/unknown - 5'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZPOSETYPE || ''
    END AS 'pose_type_estimate',
    CASE
        zDetFace.ZHASSMILE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Not Smiling'
        WHEN 2
            THEN 'Smiling'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZHASSMILE || ''
    END AS 'smile_estimate',
    CASE
        zDetFace.ZSMILETYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Not Showing Teeth'
        WHEN 2
            THEN 'Showing Teeth'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZSMILETYPE || ''
    END AS 'smile_type_estimate',
    CASE
        WHEN zDetFace.ZHASSMILE = 0
        AND zDetFace.ZSMILETYPE = 0
            THEN 'Not Smiling'
        WHEN zDetFace.ZHASSMILE = 1
        AND zDetFace.ZSMILETYPE = 1
            THEN 'Smiling without Teeth'
        WHEN zDetFace.ZHASSMILE = 1
        AND zDetFace.ZSMILETYPE = 2
            THEN 'Smiling with Teeth'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZHASSMILE || ' ' || zDetFace.ZSMILETYPE || ''
    END AS 'smile_combined_estimate',
    CASE
        zDetFace.ZLIPMAKEUPTYPE
        WHEN 0
            THEN 'zDetFace No Lip Makeup-0'
        WHEN 1
            THEN 'zDetFace Lip Makeup Detected-1'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZLIPMAKEUPTYPE || ''
    END AS 'zDetFace-Lip Makeup Type',
    CASE
        zDetFace.ZLIPMAKEUPTYPE
        WHEN 0
            THEN 'Not Wearing Lip Makeup'
        WHEN 1
            THEN 'Wearing Lip Makeup'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZLIPMAKEUPTYPE || ''
    END AS 'lip_makeup_estimate',
    CASE
        zDetFace.ZEYESSTATE
        WHEN 0
            THEN '0-StillTesting'
        WHEN 1
            THEN 'Eyes Closed-1'
        WHEN 2
            THEN 'Eyes Open-2'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZEYESSTATE || ''
    END AS 'zDetFace-Eyes State',
    CASE
        zDetFace.ZEYESSTATE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Eyes Closed'
        WHEN 2
            THEN 'Eyes Open'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZEYESSTATE || ''
    END AS 'closing_eyes_estimate',
    CASE
        WHEN zDetFace.ZISLEFTEYECLOSED = 1
        AND zDetFace.ZISRIGHTEYECLOSED = 1
            THEN 'Both Eyes Closed'
        WHEN zDetFace.ZISLEFTEYECLOSED = 0
        AND zDetFace.ZISRIGHTEYECLOSED = 0
            THEN 'Both Eyes Open'
        WHEN zDetFace.ZISLEFTEYECLOSED = 1
        AND zDetFace.ZISRIGHTEYECLOSED = 0
            THEN 'Winking'
        WHEN zDetFace.ZISLEFTEYECLOSED = 0
        AND zDetFace.ZISRIGHTEYECLOSED = 1
            THEN 'Winking'
        ELSE 'other/unknown' || zDetFace.ZISLEFTEYECLOSED || ' ' || zDetFace.ZISRIGHTEYECLOSED || ''
    END AS 'winking_estimate',
    CASE
        zDetFace.ZGLASSESTYPE
        WHEN 0
            THEN '0-StillTesting'
        WHEN 1
            THEN 'Eye Glasses-1'
        WHEN 2
            THEN 'Sun Glasses-2'
        WHEN 3
            THEN 'No Glasses-3'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZGLASSESTYPE || ''
    END AS 'zDetFace-Eye Glasses Type',
    CASE
        zDetFace.ZGLASSESTYPE
        WHEN 0
            THEN 'other/unknown'
        WHEN 1
            THEN 'Eye Glasses'
        WHEN 2
            THEN 'Sun Glasses'
        WHEN 3
            THEN 'No Glasses'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZGLASSESTYPE || ''
    END AS 'glasses_estimate',
    CASE
        zDetFace.ZEYEMAKEUPTYPE
        WHEN 0
            THEN 'No Eye Makeup-0'
        WHEN 1
            THEN 'Eye Makeup Detected-1'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZEYEMAKEUPTYPE || ''
    END AS 'zDetFace-Eye Makeup Type',
    CASE
        zDetFace.ZEYEMAKEUPTYPE
        WHEN 0
            THEN 'Not Wearing Eye Makeup'
        WHEN 1
            THEN 'Wearing Eye Makeup'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZEYEMAKEUPTYPE || ''
    END AS 'eye_makeup_estimate',
    zDetFace.ZBLURSCORE AS 'face_blur_score',
    zDetFace.ZSIZE AS 'face_size_estimate',
    /*  
     CASE    
     zIntResou.ZRESOURCETYPE
     WHEN 0 THEN 'Photo'
     WHEN 1 THEN 'Video'
     WHEN 3 THEN 'Live Photo'
     WHEN 5 THEN 'Adjustment Data'
     WHEN 6 THEN 'Screenshot'
     WHEN 9 THEN 'Alternate Photo (3rd Party App)'
     WHEN 13 THEN 'Movie'
     WHEN 14 THEN 'Wallpaper'
     ELSE 'Unknown-New-Value!: ' || zIntResou.ZRESOURCETYPE || ''
     END AS 'resource_type_estimate', */
    zAsset.ZCURATIONSCORE AS 'curation_score',
    zDetFace.ZASSET AS 'asset_contains_face',
    CASE
        zDetFace.ZASSETVISIBLE
        WHEN 0
            THEN 'Asset Not Visible Photo Library-0'
        WHEN 1
            THEN 'Asset Visible Photo Library-1'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZASSETVISIBLE || ''
    END AS 'zDetFace-Asset Visible',
    CASE
        zDetFace.ZASSETVISIBLE
        WHEN 0
            THEN 'Yes'
        WHEN 1
            THEN 'No'
        ELSE 'Unknown-New-Value!: ' || zDetFace.ZASSETVISIBLE || ''
    END AS 'is_asset_visible',
    zDetFace.ZQUALITY AS 'detected_face_quality',
    zDetFace.ZQUALITYMEASURE AS 'detected_face_quality_measure',
    zMedAnlyAstAttr.ZFACECOUNT AS 'face_count',
    zMedAnlyAstAttr.ZACTIVITYSCORE AS 'zm_activity_score',
    zMedAnlyAstAttr.ZVIDEOSCORE AS 'zm_video_score',
    zMedAnlyAstAttr.ZAUDIOSCORE AS 'zm_audio_score',
    zMedAnlyAstAttr.ZWALLPAPERSCORE AS 'zm_wallpaper_score',
    zMedAnlyAstAttr.ZAUTOPLAYSUGGESTIONSCORE AS 'zm_autoplay_suggestion_score',
    zMedAnlyAstAttr.ZBLURRINESSSCORE AS 'zm_blurriness_score',
    zMedAnlyAstAttr.ZEXPOSURESCORE AS 'zm_exposure_score',
    zCompAssetAttr.ZBEHAVIORALSCORE AS 'zc_behavioral_score',
    zCompAssetAttr.ZFAILURESCORE AS 'zc_failure_score',
    zCompAssetAttr.ZHARMONIOUSCOLORSCORE AS 'zc_harmonious_color_score',
    zCompAssetAttr.ZIMMERSIVENESSSCORE AS 'zc_immersiveness_score',
    zCompAssetAttr.ZINTERACTIONSCORE AS 'zc_interaction_score',
    zCompAssetAttr.ZINTERESTINGSUBJECTSCORE AS 'zc_interesting_subject_score',
    zCompAssetAttr.ZINTRUSIVEOBJECTPRESENCESCORE AS 'zc_intrusive_object_presence_score',
    zCompAssetAttr.ZLIVELYCOLORSCORE AS 'zc_lively_color_score',
    zCompAssetAttr.ZLOWLIGHT AS 'zc_low_light',
    zCompAssetAttr.ZNOISESCORE AS 'zc_noise_score',
    zCompAssetAttr.ZPLEASANTCAMERATILTSCORE AS 'zc_pleasant_camera_tilt_score',
    zCompAssetAttr.ZPLEASANTCOMPOSITIONSCORE AS 'zc_pleasant_composition_score',
    zCompAssetAttr.ZPLEASANTLIGHTINGSCORE AS 'zc_pleasant_lighting_score',
    zCompAssetAttr.ZPLEASANTPATTERNSCORE AS 'zc_pleasant_pattern_score',
    zCompAssetAttr.ZPLEASANTPERSPECTIVESCORE AS 'zc_pleasant_perspective_score',
    zCompAssetAttr.ZPLEASANTPOSTPROCESSINGSCORE AS 'zc_pleasant_post_processing_score',
    zCompAssetAttr.ZPLEASANTREFLECTIONSSCORE AS 'zc_pleasant_reflection_score',
    zCompAssetAttr.ZPLEASANTSYMMETRYSCORE AS 'zc_pleasant_symmetry_score',
    zCompAssetAttr.ZSHARPLYFOCUSEDSUBJECTSCORE AS 'zc_sharply_focused_subject_score',
    zCompAssetAttr.ZTASTEFULLYBLURREDSCORE AS 'zc_tastefully_blurred_score',
    zCompAssetAttr.ZWELLCHOSENSUBJECTSCORE AS 'zc_well_chosen_subject_score',
    zCompAssetAttr.ZWELLFRAMEDSUBJECTSCORE AS 'zc_well_framed_subject_score',
    zCompAssetAttr.ZWELLTIMEDSHOTSCORE AS 'zc_well_timed_shot_score'
FROM zasset
LEFT JOIN ZADDITIONALASSETATTRIBUTES zAddAssetAttr
    ON zAddAssetAttr.Z_PK = zAsset.ZADDITIONALATTRIBUTES
LEFT JOIN ZEXTENDEDATTRIBUTES zExtAttr
    ON zExtAttr.Z_PK = zAsset.ZEXTENDEDATTRIBUTES --   LEFT JOIN ZINTERNALRESOURCE zIntResou ON zIntResou.ZASSET = zAsset.Z_PK
LEFT JOIN ZDETECTEDFACE zDetFace
    ON zAsset.Z_PK = zDetFace.ZASSET
LEFT JOIN ZPERSON zPerson
    ON zPerson.Z_PK = zDetFace.ZPERSON
LEFT JOIN ZCOMPUTEDASSETATTRIBUTES zCompAssetAttr
    ON zCompAssetAttr.Z_PK = zAsset.ZCOMPUTEDATTRIBUTES
LEFT JOIN ZMEDIAANALYSISASSETATTRIBUTES zMedAnlyAstAttr
    ON zAsset.ZMEDIAANALYSISATTRIBUTES = zMedAnlyAstAttr.Z_PK