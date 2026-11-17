import os
from PIL import Image
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas

USER_UPLOAD_DIR = r"C:\Users\vaish\.gemini\antigravity\brain\8fbb0e47-b5bf-4d29-8692-30c46232485b\.user_uploaded"
OUTPUT_DIR = r"c:\Projects\EduLens"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "EduLens_Output_Screenshots.pdf")

screenshots_metadata = [
    {
        "filename": "media_1794897514490_4f7d4bee.jpg",
        "fig_num": "Figure 1",
        "title": "System Dashboard & ML Architectural Overview",
        "category": "MODULE 1: DASHBOARD",
        "description": "High-level analytics overview displaying dataset provenance (KU Leuven LMS with 756 records and 19 features), unsupervised learning paradigm, and Unit III machine learning core modules (K-Means, GMM, EM, and Model Evaluation)."
    },
    {
        "filename": "media_1794897524239_1ea96d30.png",
        "fig_num": "Figure 2",
        "title": "Dataset Explorer, Feature Taxonomies & Telemetry Preprocessing",
        "category": "MODULE 2: DATASET EXPLORER",
        "description": "LMS telemetry feature selection partitioned into Platform Activity Volume, Self-Regulated Learning & Pacing, and Forum Interaction. Includes scaling selection (StandardScaler vs. MinMaxScaler) and distribution histograms."
    },
    {
        "filename": "media_1794897528980_2bd0d833.jpg",
        "fig_num": "Figure 3",
        "title": "K-Means Clustering Laboratory — 2D PCA Projection & Convergence",
        "category": "MODULE 3: K-MEANS LAB",
        "description": "Execution of K-Means clustering (K=3, k-means++ initialization). Visualizes 2D PCA coordinate projection with cluster centroids and plots the monotonic WCSS (Inertia) objective reduction curve across 24 iterations."
    },
    {
        "filename": "media_1794897583935_1a4881d4.jpg",
        "fig_num": "Figure 4",
        "title": "K-Means Mathematical Benchmark (Scratch vs. Sklearn) & Elbow Curve",
        "category": "MODULE 3: MATHEMATICAL VALIDATION",
        "description": "Empirical mathematical benchmark proving from-scratch custom K-Means matches Scikit-Learn inertia and convergence. Includes the Elbow Method evaluation curve (K=2 to 8) and core mathematical formulation cards."
    },
    {
        "filename": "media_1794897533235_cc4e272d.jpg",
        "fig_num": "Figure 5",
        "title": "Gaussian Mixture Models (GMM) & EM Parameter Estimation",
        "category": "MODULE 4: GMM & EM LAB",
        "description": "Soft probabilistic clustering with full covariance matrices. Visualizes 2D Gaussian density components, BIC/AIC scores, and the guaranteed monotonic log-likelihood ascent curve of the Expectation-Maximization algorithm."
    },
    {
        "filename": "media_1794897537223_6338a7e6.jpg",
        "fig_num": "Figure 6",
        "title": "Clustering Model Comparison — Metrics, Contingency & BIC/AIC",
        "category": "MODULE 5: MODEL COMPARISON",
        "description": "Rigorous quantitative evaluation comparing K-Means and GMM using Silhouette Score, Davies-Bouldin Index, Adjusted Rand Index (0.5868), 4.63% borderline student detection, cross-algorithm contingency matrix, and BIC/AIC curve."
    },
    {
        "filename": "media_1794897544485_454d021c.png",
        "fig_num": "Figure 7",
        "title": "Cohort Insights — Multidimensional Behavioral Comparison",
        "category": "MODULE 6: COHORT INSIGHTS",
        "description": "Comparative population statistics and multi-metric visual bar chart contrasting final grade equivalents, failure rates, study regularity, absences, and composite vulnerability scores across the discovered student cohorts."
    },
    {
        "filename": "media_1794897621178_f2458860.jpg",
        "fig_num": "Figure 8",
        "title": "Discovered Cohort Profiles & Early Academic Risk Intervention",
        "category": "MODULE 6: RISK PROFILING",
        "description": "Unsupervised Academic Vulnerability Index (AVI) scoring and detailed behavioral profiles: Disengaged & Minimalist Learners (High Risk) vs Steady Active Learners (Low-Moderate Risk), paired with targeted pedagogical action recommendations."
    }
]

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        page_w, page_h = landscape(A4)
        
        # Header banner line
        self.setStrokeColor(colors.HexColor("#4f46e5"))
        self.setLineWidth(2)
        self.line(36, page_h - 28, page_w - 36, page_h - 28)
        
        # Header text
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1e1b4b"))
        self.drawString(36, page_h - 22, "EDULENS: STUDENT BEHAVIOURAL COHORT DISCOVERY & ACADEMIC RISK ANALYSIS")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawRightString(page_w - 36, page_h - 22, "MACHINE LEARNING UNIT III PROJECT")
        
        # Footer line
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(1)
        self.line(36, 26, page_w - 36, 26)
        
        # Footer text
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(36, 15, "Authentic Datasets: KU Leuven LMS Activity (Tiukhova et al., 2023) & UCI Student Performance (Cortez & Silva, 2008)")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(page_w - 36, 15, page_str)
        self.restoreState()


def build_pdf():
    page_w, page_h = landscape(A4)
    # Margins: 36 pt (0.5 inch)
    margin = 36
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=landscape(A4),
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )
    
    usable_w = page_w - (2 * margin)  # 841.89 - 72 = 769.89 pt
    usable_h = page_h - (2 * margin)  # 595.27 - 72 = 523.27 pt
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'FigTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=2
    )
    
    badge_style = ParagraphStyle(
        'Badge',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#4338ca')
    )
    
    desc_style = ParagraphStyle(
        'FigDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []
    
    for i, meta in enumerate(screenshots_metadata):
        img_path = os.path.join(USER_UPLOAD_DIR, meta["filename"])
        if not os.path.exists(img_path):
            print(f"Warning: File {img_path} not found!")
            continue
            
        # Top title row: Badge + Figure Title
        header_text = f"<b><font color='#4f46e5'>{meta['fig_num']}:</font> {meta['title']}</b>"
        badge_text = f"<font color='#4338ca'><b>[{meta['category']}]</b></font>"
        
        header_table = Table(
            [[Paragraph(header_text, title_style), Paragraph(badge_text, badge_style)]],
            colWidths=[usable_w * 0.78, usable_w * 0.22]
        )
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 3))
        
        # Description
        story.append(Paragraph(meta["description"], desc_style))
        story.append(Spacer(1, 2))
        
        # Calculate image dimensions to fit within remaining page space
        # Remaining height: usable_h - header (~20) - desc (~25) - spacing (~15) = ~460 pt
        max_img_w = usable_w
        max_img_h = 430  # pt
        
        with Image.open(img_path) as im:
            orig_w, orig_h = im.size
            aspect = orig_h / orig_w
            
        calc_w = max_img_w
        calc_h = calc_w * aspect
        
        if calc_h > max_img_h:
            calc_h = max_img_h
            calc_w = calc_h / aspect
            
        img_flowable = RLImage(img_path, width=calc_w, height=calc_h)
        
        # Wrap image in a table with a subtle border for a polished screenshot card look
        img_box = Table([[img_flowable]], colWidths=[calc_w])
        img_box.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
            ('LEFTPADDING', (0,0), (-1,-1), 1),
            ('RIGHTPADDING', (0,0), (-1,-1), 1),
            ('TOPPADDING', (0,0), (-1,-1), 1),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ]))
        
        story.append(img_box)
        
        # Add page break if not last
        if i < len(screenshots_metadata) - 1:
            story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {OUTPUT_PDF}")

if __name__ == '__main__':
    build_pdf()
